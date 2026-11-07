# 🏗️ BTC Copilot — Technical Architecture

This document describes the end-to-end technical architecture, component separation, AI provider failover strategy, and privacy gateway boundaries.

---

## 1. System Overview

```
                      ┌──────────────────────────────────────┐
                      │          User Browser (UI)           │
                      │  Next.js App Router (Dark Fintech)   │
                      └──────────────────┬───────────────────┘
                                         │
                         HTTPS Server-Side API Routes
                                         │
                      ┌──────────────────▼───────────────────┐
                      │       Next.js Server API Routes      │
                      │     (Zero Browser-Leaked Secrets)    │
                      └────┬──────────────┬───────────────┬──┘
                           │              │               │
       ┌───────────────────┘              │               └────────────────────┐
       ▼                                  ▼                                    ▼
┌──────────────┐             ┌─────────────────────────┐             ┌──────────────────┐
│ Mempool.space│             │     Privacy Gateway     │             │ Anomaly Engine   │
│ REST API     │             │ (Sanitization & Filter) │             │ (Deterministic   │
│ - On-Chain   │             └────────────┬────────────┘             │  Math / Stats)   │
│ - Lightning  │                          │                          └─────────┬────────┘
└──────────────┘             ┌────────────▼────────────┐                       │
                             │   Provider Factory      │                       │
                             │ (Mistral ➔ Gemini)     │◄──────────────────────┘
                             └────────────┬────────────┘  (Explains alerts)
                                          │
                        ┌─────────────────┴─────────────────┐
                        ▼                                   ▼
             ┌─────────────────────┐             ┌─────────────────────┐
             │ Mistral AI Provider │             │ Gemini AI Provider  │
             │     (Primary)       │             │ (Fallback / Failover│
             └─────────────────────┘             └─────────────────────┘
```

---

## 2. Component Breakdown

### 2.1 Frontend (`app/` & `components/`)
- Built with **Next.js 16 App Router**, **React 19**, and **Tailwind CSS**.
- **Page Layout**:
  - `/dashboard`: High-level wallet overview, real balances, recent transactions, quick actions.
  - `/assistant`: Conversational interface with Beginner / Professional toggle and contextual questions.
  - `/transactions`: Full transaction table with status badges and AI explanation triggers.
  - `/lightning`: Public Lightning Network explorer (ACINQ demo node, network liquidity, channel metrics).
  - `/monitoring`: Deterministic anomaly detection rules, alert logs, and polling controls.
  - `/security`: Security Center and transparent Privacy Gateway audit log.
  - `/settings`: Target wallet selector and demonstration presets.

### 2.2 Blockchain Integration (`lib/bitcoin/`)
- Pure read-only interaction with **Mempool.space**:
  - `mempool.ts`: On-chain address balance, UTXO sets, transaction statuses, and fee rates.
  - `lightning.ts`: Network statistics, top liquidity nodes, and channel metadata.
  - `validate-address.ts`: Deterministic client/server validation for Legacy, P2SH, SegWit (Bech32), and Taproot (Bech32m).

### 2.3 Deterministic Anomaly Detection (`lib/anomaly/`)
- **Crucial Architectural Rule**: The LLM **never** decides whether an event is suspicious.
- Pure statistical logic calculates rolling baselines and triggers alerts for:
  - `LARGE_AMOUNT`: Amount > 5× rolling average of last 20 transactions.
  - `HIGH_FREQUENCY`: Transaction count in 24h > 3× daily average.
  - `NEW_ADDRESS`: Outgoing destination address not seen in past 50 transactions.
  - `DUST_ATTACK`: Inflows under 546 satoshis (standard dust threshold).
  - `RAPID_OUTFLOW`: ≥ 3 outgoing transactions within 60 minutes.

### 2.4 Privacy Gateway (`lib/privacy/`)
- Acts as a security interceptor before any payload leaves the server towards an external AI provider:
  - `sanitize-context.ts`: Strips full public addresses to shortened references (e.g. `1A1zP1...Divfna`), redacts 64-char transaction hashes to ordinal markers (`Tx #1`), and truncates user free-form inputs.
  - `validate-output.ts`: Scans the LLM output against cryptographic regular expressions to ensure the model does not regurgitate sensitive patterns.

### 2.5 Dual AI Provider Architecture (`lib/ai/`)
- `AIProvider` unified TypeScript interface:
  - `complete(request: AIRequest): Promise<AIResponse>`
- **Failover Logic** (`provider-factory.ts`):
  1. Primary call dispatched to **Mistral AI**.
  2. If Mistral returns a retryable error (HTTP 429 rate limit, 503 service unavailable, or network timeout), the engine catches the exception and immediately invokes **Google Gemini AI**.
  3. If both providers fail, a graceful, controlled error is returned. Non-AI wallet features remain fully functional.
  4. The frontend is agnostic of which provider fulfilled the prompt.
