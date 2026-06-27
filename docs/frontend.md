# Frontend Documentation

## Stack

- React 18 + Vite + TypeScript
- Tailwind CSS (Hubify warm editorial system)
- Framer Motion (animations)
- Lenis.js + GSAP ScrollTrigger (smooth scroll)
- genlayer-js ^1.1.7 (contract interaction)
- React Router v6

## Color System

| Token | Light | Dark |
|---|---|---|
| Background | #f0ebe3 | #1a1714 |
| Text | #1c1a17 | #f0ebe3 |
| Cards | #f7f4ef | #242018 |
| Border | #ddd8ce | #3a3530 |
| Accent | #2a6049 | #2a6049 |

## Typography

- Headings: Playfair Display (Google Fonts)
- Body: Inter (Google Fonts)
- Code: JetBrains Mono (Google Fonts)

## Pages

| Route | Component | Description |
|---|---|---|
| `/` | Landing | Full landing page with all 7 sections |
| `/submit` | SubmitAudit | Audit submission form |
| `/registry` | Registry | Public searchable audit list |
| `/my-audits` | MyAudits | Wallet-filtered audit history |
| `/docs` | Docs | In-app documentation |
| `*` | NotFound | Styled 404 |

## Key Files

```
src/config/chains.ts       — chain config, contract address, explorer URLs
src/lib/genlayer/client.ts — MetaMask connect, chain switch, createClient
src/lib/contracts/Nexus.ts — contract read/write wrappers + parseMap
src/hooks/useWallet.ts     — wallet state, connect/disconnect
src/hooks/useNexus.ts      — contract interaction hook
```

## Lenis + GSAP Wiring

```ts
const lenis = new Lenis()
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)
```
Initialized once in `src/main.tsx` before React renders.
