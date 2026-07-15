import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ExternalLink, RefreshCw, Plus, AlertCircle } from 'lucide-react'
import { useWallet } from '@/hooks/useWallet'
import NexusContract, { type AuditReport } from '@/lib/contracts/Nexus'
import { getExplorerTxUrl, getDeployTx } from '@/config/chains'

function VerdictBadge({ verdict }: { verdict: string }) {
  const map: Record<string, string> = {
    PASS: 'badge-pass', FAIL: 'badge-fail',
    'NEEDS_REVIEW': 'badge-needs-review', PENDING: 'badge-pending',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${map[verdict] || 'badge-pending'}`}>
      {verdict || 'PENDING'}
    </span>
  )
}

export default function MyAudits() {
  const { address, isConnected, shortAddress, connect, isConnecting } = useWallet()
  const [audits, setAudits] = useState<AuditReport[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMyAudits = useCallback(async () => {
    if (!address) return
    setLoading(true)
    setError(null)
    try {
      const contract = new NexusContract(address)
      const all = await contract.getAllAudits(200)
      const mine = all.filter(a => a.submitter.toLowerCase() === address.toLowerCase())
      setAudits(mine.reverse())
    } catch {
      setError('Failed to load your audits.')
    } finally {
      setLoading(false)
    }
  }, [address])

  useEffect(() => { if (isConnected) fetchMyAudits() }, [isConnected, fetchMyAudits])

  const findings = (a: AuditReport) => { try { return JSON.parse(a.findings) } catch { return [] } }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="text-xs font-semibold tracking-widest text-accent uppercase mb-3 block">My Audits</span>
              <h1 className="font-display text-4xl font-bold text-[#1c1a17] dark:text-[#f0ebe3]">Your Audit History</h1>
              {isConnected && (
                <p className="text-xs font-mono text-[#1c1a17]/40 dark:text-[#f0ebe3]/40 mt-2">{shortAddress}</p>
              )}
            </div>
            {isConnected && (
              <div className="flex gap-2">
                <button
                  onClick={fetchMyAudits}
                  disabled={loading}
                  className="p-3 rounded-xl border border-[#ddd8ce] dark:border-[#3a3530] hover:border-accent/50 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 text-[#1c1a17]/60 dark:text-[#f0ebe3]/60 ${loading ? 'animate-spin' : ''}`} />
                </button>
                <Link
                  to="/submit"
                  className="flex items-center gap-2 px-4 py-3 shimmer-btn rounded-xl text-sm font-semibold"
                >
                  <Plus className="w-4 h-4" /> New Audit
                </Link>
              </div>
            )}
          </div>

          {/* Not connected */}
          {!isConnected && (
            <div className="rounded-2xl border border-[#ddd8ce] dark:border-[#3a3530] bg-[#f7f4ef] dark:bg-[#242018] p-12 text-center">
              <h3 className="font-display font-bold text-xl mb-3 text-[#1c1a17] dark:text-[#f0ebe3]">Connect to view your audits</h3>
              <p className="text-sm text-[#1c1a17]/60 dark:text-[#f0ebe3]/60 mb-6">Your audit history is tied to your wallet address.</p>
              <button onClick={connect} disabled={isConnecting} className="shimmer-btn px-6 py-3 text-sm font-semibold rounded-lg">
                {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
              </button>
            </div>
          )}

          {/* Loading */}
          {isConnected && loading && (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-40 rounded-2xl bg-[#f7f4ef] dark:bg-[#242018] border border-[#ddd8ce] dark:border-[#3a3530] animate-pulse" />
              ))}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 p-5 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Empty */}
          {isConnected && !loading && !error && audits.length === 0 && (
            <div className="text-center py-20 text-[#1c1a17]/40 dark:text-[#f0ebe3]/40">
              <p className="font-display text-2xl mb-2">No audits yet</p>
              <p className="text-sm mb-6">Submit your first repository to get started.</p>
              <Link to="/submit" className="shimmer-btn px-6 py-3 text-sm font-semibold rounded-lg inline-block">
                Submit Audit
              </Link>
            </div>
          )}

          {/* Audit list */}
          {!loading && !error && audits.length > 0 && (
            <div className="space-y-4">
              {audits.map((audit, i) => {
                const fs = findings(audit)
                const date = new Date(audit.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                return (
                  <motion.div
                    key={audit.audit_id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.07 }}
                    className="rounded-2xl border border-[#ddd8ce] dark:border-[#3a3530] bg-[#f7f4ef] dark:bg-[#242018] p-6"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <a
                          href={audit.repo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-sm font-semibold text-accent hover:underline flex items-center gap-1"
                        >
                          {audit.repo_url.replace('https://github.com/', '')}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <p className="text-xs text-[#1c1a17]/40 dark:text-[#f0ebe3]/40 mt-1 font-mono">#{audit.audit_id} · {date}</p>
                      </div>
                      <VerdictBadge verdict={audit.verdict} />
                    </div>
                    <p className="text-sm text-[#1c1a17]/70 dark:text-[#f0ebe3]/70 mb-3 italic">"{audit.claim}"</p>
                    {audit.summary && <p className="text-sm text-[#1c1a17]/60 dark:text-[#f0ebe3]/60 mb-3">{audit.summary}</p>}
                    {fs.length > 0 && (
                      <ul className="space-y-1 mb-3">
                        {fs.map((f: string, j: number) => (
                          <li key={j} className="text-xs text-[#1c1a17]/50 dark:text-[#f0ebe3]/50 flex items-start gap-2">
                            <span className="text-accent">·</span>{f}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="flex items-center justify-between pt-3 border-t border-[#ddd8ce] dark:border-[#3a3530]">
                      <span className="text-xs font-mono text-[#1c1a17]/30 dark:text-[#f0ebe3]/30">
                        Risk: {Number(audit.risk_score)}/10
                      </span>
                      <a
                        href={`${getExplorerTxUrl()}/${getDeployTx()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-accent hover:underline flex items-center gap-1"
                      >
                        View onchain <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
