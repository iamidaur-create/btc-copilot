# 🔒 BTC Copilot — Security & Privacy Policy

> **Security First**: BTC Copilot is designed from the ground up as a **read-only intelligence platform**. It never holds, requests, or signs private Bitcoin keys.

---

## 1. Core Security Guarantees

### 1.1 100% Read-Only Architecture
- BTC Copilot **never** asks for:
  - Private keys (`WIF`, `xprv`)
  - BIP-39 mnemonic seed phrases (12/24 words)
  - Hardware wallet signing approvals
  - Wallet passwords or passphrases
- The application has **no transaction signing or broadcasting capability**.

### 1.2 Isolated Server-Side Credentials
- The Gemini API key (`GEMINI_API_KEY`) is stored in a server-side environment variable.
- No API keys are prefixed with `NEXT_PUBLIC_`. They are unreachable by the browser bundle or client devtools.

### 1.3 Untrusted Input Philosophy
- Blockchain data returned from third-party APIs (such as OP_RETURN scripts, transaction messages, or address labels) is treated as **untrusted data**.
- All data fed into LLM prompts is structured strictly as JSON data blocks, preventing prompt injection attacks embedded in blockchain memos.

---

## 2. Privacy Gateway Design

The external Gemini provider receives only the minimum information necessary to explain a transaction or an anomaly alert:

| Information | Gateway Action | Rationale |
|---|---|---|
| Private Keys / Seed Phrases | **BLOCKED & REJECTED** | Instant abort if detected |
| Public Addresses | **Truncated** (`1A1zP1...Divfna`) | Reduces linkability to external AI logs |
| Transaction IDs (txid) | **Preserved** as public blockchain identifiers | Required for accurate, contextual transaction explanations |
| Financial Amounts | **Sanitized numerical summaries** | Provides only data needed to explain fees/UTXO |
| User Prompts | **Length-capped (500 chars) & sanitized** | Mitigates jailbreaks and prompt injections |

---

## 3. Threat Model & Mitigations

| Threat Vector | Potential Impact | Mitigation in BTC Copilot |
|---|---|---|
| **API Key Leakage** | Unauthorized billing or quota exhaustion | Server-side API routes only; `.gitignore` blocks `.env.local` |
| **Prompt Injection via Blockchain** | Malicious OP_RETURN memo forces LLM to output malicious instructions | Delimited JSON data structures; system prompt instructions explicitly label blockchain data as untrusted text |
| **Hallucinated Financial Advice** | User acts on inaccurate AI outputs | Deterministic statistical engine generates alerts; AI only explains; disclaimer presented on all assistant views |
| **AI Output Leakage** | AI inadvertently outputs sensitive pattern | `validate-output.ts` regex post-processor scrubs responses before client delivery |
| **Denial of Service (DoS)** | Excessive polling exhausts rate limits | Server-side caching (60s TTL) and minimum polling intervals |
