# NEXUS — Onchain Code Audit Protocol

> AI-native onchain code audit protocol built on GenLayer. Submit any GitHub repository with a claim about your codebase and let decentralized AI validators independently fetch, analyze, and reach consensus on the audit result — checked against an independent metadata source, with a genuine dispute mechanic.

**Live:** https://nexus-genlayer.vercel.app _(frontend redeploy pending — see below)_  
**StudioNet contract:** `0x62E1D57199FefF364A00DeE0059abdE3303A286c`  
**StudioNet deploy TX:** https://explorer-studio.genlayer.com/tx/0x58711bd190df3187abbae8de83777b9de3e6a40c64999bc548571b640888135a  
**Bradbury contract:** `0x33bcb525b70E6fe59883Eeb7BC0Efa557df1463d`  
**Bradbury deploy TX:** https://explorer-bradbury.genlayer.com/tx/0xa680b72424a52429ad096a9e1987174f8048511df706c47009d3405b35fe78b8  
**Network toggle:** StudioNet / Bradbury, switchable in the navbar

---

## Post-review update

An earlier submission of a similar single-fetch-single-judgment concept
(SourceChecker) was rejected: a caller-selected page fetched and judged by
itself only proves the page repeats a claim — it doesn't establish anything
independently. This version addresses the same structural gap directly:

1. **Independent metadata source.** Every audit fetches the repo's own
   README/source **and** the GitHub REST API's repository metadata (stars,
   issues, last-updated, license) — structured facts the submitter does not
   author as prose, checked separately from the README content their claim
   is written in.
2. **Genuine dispute mechanic.** Any second party (not the original
   submitter) can call `dispute_audit()` once per audit with a counter-claim
   and optional counter-evidence URL. This triggers a fresh leader/validator
   run that fetches the counter-evidence and weighs it against the original
   claim, the README/source, and the independent metadata — and can revise
   the verdict. That creates a real submitter-vs-disputer pair instead of a
   single party asking an oracle for an opinion.

---

## What It Does

Submit a GitHub repository + a specific claim → GenLayer validators independently scrape your README, source files, and GitHub API metadata → AI analyzes the claim against all three → consensus verdict stored permanently onchain, contestable once by any second party.

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

No ETH handling. No token transfers. No financial rewards. Pure neutral utility registry
