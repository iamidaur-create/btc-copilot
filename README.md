# ⚡ BTC Copilot — Intelligent Bitcoin Wallet Assistant

> **"Your intelligent Bitcoin wallet companion."**  
> An AI-powered Bitcoin wallet intelligence platform built for hackathons, beginners, and seasoned Bitcoiners.

---

## 🌟 Project Vision

Understanding Bitcoin transactions, UTXO consolidation, script types (Legacy, SegWit, Taproot), stuck mempool transactions, and Lightning Network liquidity shouldn't require reading raw hex or combing through developer docs.

**BTC Copilot** connects to live blockchain data via **Mempool.space** to provide:
1. **Wallet Intelligence Dashboard** — Real-time balances, confirmed vs. unconfirmed transaction breakdown, and stats.
2. **AI Transaction Explainer** — Natural language explanations of technical mechanics with Beginner and Professional explanation modes.
3. **Lightning Network Explorer** — Public node lookup, liquidity metrics, and routing channel intelligence.
4. **Deterministic Statistical Anomaly Detection** — Pure mathematical detection of unusually large transfers, transaction bursts, and dust attacks without LLM hallucination.
5. **AI Alert Explanations** — Plain-language breakdowns explaining why the statistical engine triggered an alert and what actions to take.
6. **Privacy Gateway & Read-Only Guarantee** — Zero private keys, zero seed phrases, and sanitized external AI calls.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons, Recharts |
| **Backend** | Next.js Server-Side Route Handlers, TypeScript |
| **Blockchain** | Mempool.space REST APIs (On-chain & Lightning Network) |
| **AI Providers** | **Mistral AI** (Primary) + **Google Gemini AI** (Automatic Fallback) |
| **Privacy** | Built-in Privacy Gateway (Address truncation, regex scanning, injection defense) |
| **Security** | 100% Read-Only, strictly server-side credentials, zero transaction signing |

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- **Node.js**: v20 or higher (v22+ recommended)
- **npm** or **pnpm**

### 2. Clone and Install
```bash
git clone https://github.com/your-username/btc-copilot.git
cd btc-copilot
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Edit `.env.local` to configure your AI provider API keys:
```env
MISTRAL_API_KEY=your_mistral_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

*(Note: Blockchain explorer queries use free public Mempool.space endpoints and do not require an API key).*

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Verification

Run the deterministic address validation test suite:
```bash
node --experimental-strip-types scripts/test-validator.ts
```

Run production type checking and build:
```bash
npm run build
```

---

## 🛡️ Security & Read-Only Guarantee

BTC Copilot operates strictly in **read-only mode**:
- **Never** stores or asks for private keys or seed phrases.
- **Never** broadcasts or signs transactions.
- **Never** transmits raw private credentials to LLMs.
- All blockchain and user data is sanitized through the **Privacy Gateway** before reaching AI models.

For full architectural details, see [ARCHITECTURE.md](./ARCHITECTURE.md) and [SECURITY.md](./SECURITY.md).
