import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, RefreshCw, ExternalLink, AlertCircle, Flag, Loader2 } from 'lucide-react'
import NexusContract, { type AuditReport } from '@/lib/contracts/Nexus'
import { getExplorerTxUrl, getDeployTx, onNetworkChange } from '@/config/chains'
import { useWallet } from '@/hooks/useWallet'
import { useNexus } from '@/hooks/useNexus'

function VerdictBadge({ verdict }: { verdict: string }) {
  const map: Record<string, string> = {
    PASS: 'badge-pass',
    FAIL: 'badge-fail',
    'NEEDS_REVIEW': 'badge-needs-review',
    PENDING: 'badge-pending',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${map[verdict] || 'badge-pending'}`}>
      {verdict || 'PENDING'}
    </span>
  )
}

function RiskBar({ score }: { score: number }) {
  const n = Number(score)
  const color = n <= 3 ? 'bg-green-500' : n <= 6 ? 'bg-yellow-500' : 'bg-red-500'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-[#ddd8ce] dark:bg-[#3a3530] overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${(n / 10) * 100}%` }} />
      </div>
      <span className="text-xs font-mono text-[#1c1a17]/60 dark:text-[#f0ebe3]/60">{n}/10</span>
    </div>
  )
}

function AuditCard({ audit, index, onDisputed }: { audit: AuditReport; index: number; onDisputed?: () => void }) {
  const short = (url: string) => url.replace('https://github.com/', '').replace('https://', '')
  const findings = (() => { try { return JSON.parse(audit.findings) } catch { return [] } })()
  const date = new Date(audit.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  const { address, isConnected, connect } = useWallet()
  const { disputeAudit } = useNexus(address)
  const [disputing, setDisputing] = useState(false)
  const [counterClaim, setCounterClaim] = useState('')
  const [counterUrl, setCounterUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [disputeErr, setDisputeErr] = useState('')

  const handleDispute = async () => {
    if (!isConnected) { connect(); return }
    if (!counterClaim.trim()) return
    setSubmitting(true)
    setDisputeErr('')
    const ok = await disputeAudit(Number(audit.audit_id), counterClaim.trim(), counterUrl.trim())
    setSubmitting(false)
    if (ok) {
      setDisputing(false)
      setCounterClaim('')
      setCounterUrl('')
      onDisputed?.()
    } else {
      setDisputeErr('Dispute failed. Check your wallet and network.')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="rounded-2xl border border-[#ddd8ce] dark:border-[#3a3530] bg-[#f7f4ef] dark:bg-[#242018] p-6 card-hover"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <a
            href={audit.repo_url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm font-semibold text-accent hover:underline flex items-center gap-1 truncate"
          >
            {short(audit.repo_url)} <ExternalLink className="w-3 h-3 shrink-0" />
          </a>
          <p className="text-xs text-[#1c1a17]/50 dark:text-[#f0ebe3]/50 mt-1 font-mono">
            #{audit.audit_id} · {date}{audit.disputed ? ' · disputed' : ''}
          </p>
        </div>
        <VerdictBadge verdict={audit.verdict} />
      </div>

      <p className="text-sm text-[#1c1a17]/80 dark:text-[#f0ebe3]/80 mb-3 leading-relaxed italic">
        "{audit.claim}"
      </p>

      {audit.summary && (
        <p className="text-sm text-[#1c1a17]/60 dark:text-[#f0ebe3]/60 mb-4 leading-relaxed">
          {audit.summary}
        </p>
      )}

      {audit.metadata_note && (
        <p className="text-xs text-[#1c1a17]/45 dark:text-[#f0ebe3]/45 mb-4 leading-relaxed">
          <span className="font-semibold">Independent metadata:</span> {audit.metadata_note}
        </p>
      )}

      {Number(audit.risk_score) > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-[#1c1a17]/50 dark:text-[#f0ebe3]/50 mb-1.5">Risk Score</p>
          <RiskBar score={Number(audit.risk_score)} />
        </div>
      )}

      {findings.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-[#1c1a17]/50 dark:text-[#f0ebe3]/50 mb-2">Findings</p>
          <ul className="space-y-1">
            {findings.map((f: string, i: number) => (
              <li key={i} className="text-xs text-[#1c1a17]/60 dark:text-[#f0ebe3]/60 flex items-start gap-2">
                <span className="text-accent mt-0.5">·</span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-[#ddd8ce] dark:border-[#3a3530] flex items-center justify-between">
        <span className="text-xs font-mono text-[#1c1a17]/30 dark:text-[#f0ebe3]/30 truncate">
          {audit.submitter.slice(0, 10)}...
        </span>
        <div className="flex items-center gap-3">
          {!audit.disputed && (
            <button
              onClick={() => setDisputing((d) => !d)}
              className="text-xs text-amber-700 dark:text-amber-500 hover:underline flex items-center gap-1"
            >
              <Flag className="w-3 h-3" /> Dispute
            </button>
          )}
          <a
            href={`${getExplorerTxUrl()}/${getDeployTx()}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-accent hover:underline flex items-center gap-1"
          >
            Onchain <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      <AnimatePresence>
        {disputing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-[#ddd8ce] dark:border-[#3a3530] space-y-2">
              <p className="text-[11px] text-[#1c1a17]/50 dark:text-[#f0ebe3]/50">
                Contest this verdict. Validators will re-check the claim against your
                counter-evidence and the original fetched sources.
              </p>
              <textarea
                value={counterClaim}
                onChange={e => setCounterClaim(e.target.value)}
                placeholder="Why is this verdict wrong?"
                rows={2}
                maxLength={500}
                className="w-full px-3 py-2 rounded-lg border border-[#ddd8ce] dark:border-[#3a3530] bg-[#f0ebe3] dark:bg-[#1a1714] text-xs text-[#1c1a17] dark:text-[#f0ebe3] focus:outline-none focus:border-accent"
              />
              <input
                type="url"
                value={counterUrl}
                onChange={e => setCounterUrl(e.target.value)}
                placeholder="Counter-evidence URL (optional)"
                className="w-full px-3 py-2 rounded-lg border border-[#ddd8ce] dark:border-[#3a3530] bg-[#f0ebe3] dark:bg-[#1a1714] text-xs text-[#1c1a17] dark:text-[#f0ebe3] focus:outline-none focus:border-accent"
              />
              {disputeErr && <p className="text-xs text-red-600">{disputeErr}</p>}
              <button
                onClick={handleDispute}
                disabled={submitting || !counterClaim.trim()}
                className="shimmer-btn px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 disabled:opacity-40"
              >
                {submitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Flag className="w-3 h-3" />}
                {submitting ? 'Submitting…' : isConnected ? 'Submit Dispute' : 'Connect Wallet to Dispute'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function Registry() {
  const [audits, setAudits] = useState<AuditReport[]>([])
  const [filtered, setFiltered] = useState<AuditReport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<string>('ALL')

  const fetchAudits = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const contract = new NexusContract()
      const data = await contract.getAllAudits(100)
      const sorted = [...data].reverse()
      setAudits(sorted)
      setFiltered(sorted)
    } catch {
      setError('Failed to load audits. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAudits() }, [fetchAudits])

  // Re-fetch immediately when the person switches networks, since audits
  // are network-specific (different contract, different data).
  useEffect(() => onNetworkChange(() => fetchAudits()), [fetchAudits])

  useEffect(() => {
    let result = audits
    if (filter !== 'ALL') result = result.filter(a => a.verdict === filter)
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(a =>
        a.repo_url.toLowerCase().includes(q) ||
        a.claim.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q)
      )
    }
    setFiltered(result)
  }, [audits, search, filter])

  const filters = ['ALL', 'PASS', 'FAIL', 'NEEDS_REVIEW']

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="text-xs font-semibold tracking-widest text-accent uppercase mb-3 block">Registry</span>
              <h1 className="font-display text-4xl font-bold text-[#1c1a17] dark:text-[#f0ebe3]">Public Audit Registry</h1>
              <p className="text-[#1c1a17]/60 dark:text-[#f0ebe3]/60 mt-2">
                {audits.length} audit{audits.length !== 1 ? 's' : ''} stored onchain
              </p>
            </div>
            <button
              onClick={fetchAudits}
              disabled={loading}
              className="p-3 rounded-xl border border-[#ddd8ce] dark:border-[#3a3530] hover:border-accent/50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 text-[#1c1a17]/60 dark:text-[#f0ebe3]/60 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Search + Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1c1a17]/30 dark:text-[#f0ebe3]/30" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by repo, claim, or summary..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#ddd8ce] dark:border-[#3a3530] bg-[#f7f4ef] dark:bg-[#242018] text-sm text-[#1c1a17] dark:text-[#f0ebe3] placeholder:text-[#1c1a17]/30 dark:placeholder:text-[#f0ebe3]/30 focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            <div className="flex gap-2">
              {filters.map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                    filter === f
                      ? 'bg-accent text-white border-accent'
                      : 'border-[#ddd8ce] dark:border-[#3a3530] text-[#1c1a17]/60 dark:text-[#f0ebe3]/60 hover:border-accent/50'
                  }`}
                >
                  {f === 'NEEDS_REVIEW' ? 'REVIEW' : f}
                </button>
              ))}
            </div>
          </div>

          {/* States */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-48 rounded-2xl bg-[#f7f4ef] dark:bg-[#242018] border border-[#ddd8ce] dark:border-[#3a3530] animate-pulse" />
              ))}
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 p-5 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="text-center py-20 text-[#1c1a17]/40 dark:text-[#f0ebe3]/40">
              <p className="font-display text-2xl mb-2">No audits found</p>
              <p className="text-sm">Be the first to submit a repository for auditing.</p>
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((audit, i) => (
                <AuditCard key={audit.audit_id} audit={audit} index={i} onDisputed={fetchAudits} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
