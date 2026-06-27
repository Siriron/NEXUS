import { useState } from 'react'
import { motion } from 'framer-motion'
import { CONTRACT_ADDRESS, STUDIONET_CONFIG, DEPLOY_TX, EXPLORER_TX_URL } from '@/config/chains'

const sections = [
  {
    id: 'overview',
    title: 'Overview',
    content: `NEXUS is an AI-native onchain code audit protocol built on GenLayer. It allows any developer to submit a GitHub repository alongside a specific claim about their codebase — and receive a verifiable, consensus-backed audit result stored permanently in a GenLayer Intelligent Contract.

Unlike traditional audits (expensive, opaque, centralized), NEXUS leverages GenLayer's Optimistic Democracy consensus to have multiple independent AI validators independently fetch your code, analyze your claim, and agree on a result — without any human intermediary.`,
  },
  {
    id: 'how-it-works',
    title: 'How It Works',
    content: `1. Connect your MetaMask wallet to GenLayer Studio (Chain ID: 61999).
2. Submit your GitHub repository URL and a specific claim about your code.
3. GenLayer validators independently fetch your README and source files via GitHub's raw API.
4. Each validator runs the analysis independently and returns a structured result.
5. The leader and validators compare: verdicts must match exactly, risk scores within ±2.
6. Once consensus is reached, the result is written permanently to the smart contract.`,
  },
  {
    id: 'architecture',
    title: 'Architecture',
    content: `Frontend: React + Vite + TypeScript + Tailwind CSS + Framer Motion
SDK: genlayer-js ^1.1.7 (studionet chain)
Contract: Python GenLayer Intelligent Contract
Storage: TreeMap[u256, AuditReport] — immutable onchain records
Nondet: gl.nondet.web.get() → gl.nondet.exec_prompt() pipe-delimited response
Consensus: gl.vm.run_nondet_unsafe() — leader/validator pattern
Response format: AUDIT=<verdict>|<risk_score>|<findings>|<summary>`,
  },
  {
    id: 'contract',
    title: 'Smart Contract',
    content: `Contract Address: ${CONTRACT_ADDRESS}
Network: ${STUDIONET_CONFIG.chainName} (Chain ID: ${STUDIONET_CONFIG.chainId})
Deploy TX: ${DEPLOY_TX}
Explorer: ${EXPLORER_TX_URL}/${DEPLOY_TX}

Functions:
• submit_audit(repo_url: str, claim: str) → None
• get_audit(audit_id: int) → str (JSON)
• get_all_audits(limit: int) → str (JSON array)
• get_total() → str (JSON)`,
  },
  {
    id: 'api',
    title: 'API Reference',
    content: `Read functions (no wallet required):
• getAllAudits(limit?: number): Promise<AuditReport[]>
• getAudit(id: number): Promise<AuditReport | null>
• getTotal(): Promise<number>

Write functions (wallet required):
• submitAudit(repoUrl: string, claim: string): Promise<receipt>

AuditReport shape:
{
  audit_id: string
  submitter: string
  repo_url: string
  claim: string
  verdict: "PASS" | "FAIL" | "NEEDS_REVIEW"
  risk_score: string  // "1"–"10"
  findings: string    // JSON array
  summary: string
  status: string      // "COMPLETE"
  created_at: string
}`,
  },
  {
    id: 'faq',
    title: 'FAQ',
    content: `Q: How long does an audit take?
A: Typically 2–5 minutes. The transaction finalizes once all validators reach consensus.

Q: What files do validators fetch?
A: README.md from the main branch, plus common source files (src/index.ts, main.py, etc.).

Q: Can I audit a private repo?
A: Not currently — validators fetch from GitHub's public raw API. Public repos only.

Q: What does NEEDS_REVIEW mean?
A: Insufficient evidence was found to conclusively support or refute your claim.

Q: Can audit results be changed?
A: No. All results are written to an immutable TreeMap in the GenLayer contract. No admin functions.

Q: What is the risk score?
A: 1 = very low risk / claim well supported. 10 = high risk / claim unsupported or contradicted.`,
  },
]

export default function Docs() {
  const [active, setActive] = useState('overview')

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="mb-10">
            <span className="text-xs font-semibold tracking-widest text-accent uppercase mb-3 block">Documentation</span>
            <h1 className="font-display text-4xl font-bold text-[#1c1a17] dark:text-[#f0ebe3]">NEXUS Protocol Docs</h1>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <nav className="md:w-52 shrink-0">
              <ul className="space-y-1 md:sticky md:top-24">
                {sections.map(s => (
                  <li key={s.id}>
                    <button
                      onClick={() => setActive(s.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        active === s.id
                          ? 'bg-accent/10 text-accent'
                          : 'text-[#1c1a17]/60 dark:text-[#f0ebe3]/60 hover:text-[#1c1a17] dark:hover:text-[#f0ebe3]'
                      }`}
                    >
                      {s.title}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {sections.filter(s => s.id === active).map(s => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-2xl border border-[#ddd8ce] dark:border-[#3a3530] bg-[#f7f4ef] dark:bg-[#242018] p-8"
                >
                  <h2 className="font-display text-2xl font-bold text-[#1c1a17] dark:text-[#f0ebe3] mb-6">{s.title}</h2>
                  <pre className="font-body text-sm text-[#1c1a17]/80 dark:text-[#f0ebe3]/80 whitespace-pre-wrap leading-relaxed">
                    {s.content}
                  </pre>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
