# NEXUS — Onchain Code Audit Protocol

> AI-native onchain code audit protocol built on GenLayer. Submit any GitHub repository with a claim about your codebase and let decentralized AI validators independently fetch, analyze, and reach consensus on the audit result.

**Live:** https://nexus-genlayer.vercel.app  
**Contract:** `0xD2d27d4Ca5cD0F38461a991E1F290173c30C292f`  
**Deploy TX:** https://explorer-studio.genlayer.com/tx/0x0acea451ca423998a5cc1fd607ff35e1698707837e7c1adf495b49ea273c0672  
**Network:** GenLayer Studio (Chain ID: 61999)

---

## What It Does

Submit a GitHub repository + a specific claim → GenLayer validators independently scrape your README and source files → AI analyzes the claim against the evidence → consensus verdict stored permanently onchain.

**Verdicts:** `PASS` · `FAIL` · `NEEDS_REVIEW`  
**Risk Score:** 1 (low risk) → 10 (high risk)

---

## Tech Stack

- **Frontend:** React + Vite + TypeScript + Tailwind CSS + Framer Motion
- **Smooth Scroll:** Lenis.js + GSAP ScrollTrigger
- **SDK:** genlayer-js ^1.1.7
- **Contract:** Python GenLayer Intelligent Contract
- **Chain:** StudioNet (61999)
- **Deploy:** Vercel

---

## Architecture

```
User submits repo URL + claim
       ↓
submit_audit() write tx
       ↓
leader_fn() fetches README + source via GitHub raw API
       ↓
gl.nondet.exec_prompt() → AUDIT=verdict|risk|findings|summary
       ↓
validator_fn() independently re-fetches + re-analyzes
       ↓
Verdict match + risk score ±2 → consensus
       ↓
AuditReport stored in TreeMap[u256, AuditReport]
```

---

## Local Setup

```bash
git clone https://github.com/Siriron/NEXUS
cd NEXUS
npm install
cp .env.example .env
npm run dev
```

`.env` variables:
```
VITE_CONTRACT_ADDRESS=0xD2d27d4Ca5cD0F38461a991E1F290173c30C292f
VITE_GENLAYER_RPC_URL=https://studio.genlayer.com/api
VITE_EXPLORER_URL=https://explorer-studio.genlayer.com
```

---

## Contract

See [`contracts/nexus.py`](./contracts/nexus.py) and [`docs/contracts.md`](./docs/contracts.md).

No ETH handling. No token transfers. No financial rewards. Pure neutral utility registry.
