import { useState } from 'react'
import { motion } from 'framer-motion'
import { GitBranch, FileCheck, AlertCircle, CheckCircle, ExternalLink, Loader2 } from 'lucide-react'
import { useWallet } from '@/hooks/useWallet'
import { useNexus } from '@/hooks/useNexus'
import { getExplorerTxUrl } from '@/config/chains'

export default function SubmitAudit() {
  const { address, isConnected, connect, isConnecting } = useWallet()
  const { loading, error, txHash, submitAudit } = useNexus(address)
  const [repoUrl, setRepoUrl] = useState('')
  const [claim, setClaim] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async () => {
    if (!repoUrl.trim() || !claim.trim()) return
    const ok = await submitAudit(repoUrl.trim(), claim.trim())
    if (ok) setSuccess(true)
  }

  const claimExamples = [
    'This contract has no reentrancy vulnerabilities.',
    'All public functions are documented with NatSpec.',
    'The codebase follows security best practices.',
    'All state-changing functions have proper access control.',
  ]

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-10">
            <span className="text-xs font-semibold tracking-widest text-accent uppercase mb-3 block">Submit</span>
            <h1 className="font-display text-4xl font-bold text-[#1c1a17] dark:text-[#f0ebe3] mb-3">
              Audit Your Repository
            </h1>
            <p className="text-[#1c1a17]/60 dark:text-[#f0ebe3]/60 leading-relaxed">
              Submit a GitHub repository and a specific claim. GenLayer validators will independently fetch, analyze, and reach consensus — storing the result permanently onchain.
            </p>
          </div>

          {/* Connect wallet gate */}
          {!isConnected && (
            <div className="rounded-2xl border border-[#ddd8ce] dark:border-[#3a3530] bg-[#f7f4ef] dark:bg-[#242018] p-8 text-center mb-8">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <GitBranch className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-display font-bold text-lg mb-2 text-[#1c1a17] dark:text-[#f0ebe3]">Connect Your Wallet</h3>
              <p className="text-sm text-[#1c1a17]/60 dark:text-[#f0ebe3]/60 mb-6">
                You need MetaMask connected to GenLayer Studio to submit an audit.
              </p>
              <button onClick={connect} disabled={isConnecting} className="shimmer-btn px-6 py-3 text-sm font-semibold rounded-lg">
                {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
              </button>
            </div>
          )}

          {/* Success state */}
          {success && txHash && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800 p-8 text-center mb-8"
            >
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-display font-bold text-xl mb-2 text-[#1c1a17] dark:text-[#f0ebe3]">Audit Submitted!</h3>
              <p className="text-sm text-[#1c1a17]/60 dark:text-[#f0ebe3]/60 mb-6">
                Your audit has been submitted and the result will be stored onchain once validators reach consensus.
              </p>
              <a
                href={`${getExplorerTxUrl()}/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
              >
                View on Explorer <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <div className="mt-4">
                <button
                  onClick={() => { setSuccess(false); setRepoUrl(''); setClaim('') }}
                  className="text-sm text-[#1c1a17]/50 dark:text-[#f0ebe3]/50 hover:text-accent transition-colors"
                >
                  Submit another audit
                </button>
              </div>
            </motion.div>
          )}

          {/* Form */}
          {!success && (
            <div className="rounded-2xl border border-[#ddd8ce] dark:border-[#3a3530] bg-[#f7f4ef] dark:bg-[#242018] p-8 space-y-6">
              {/* Repo URL */}
              <div>
                <label className="block text-sm font-semibold text-[#1c1a17] dark:text-[#f0ebe3] mb-2">
                  GitHub Repository URL <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <GitBranch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1c1a17]/40 dark:text-[#f0ebe3]/40" />
                  <input
                    type="url"
                    value={repoUrl}
                    onChange={e => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/username/repository"
                    disabled={!isConnected || loading}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#ddd8ce] dark:border-[#3a3530] bg-[#f0ebe3] dark:bg-[#1a1714] text-[#1c1a17] dark:text-[#f0ebe3] text-sm placeholder:text-[#1c1a17]/30 dark:placeholder:text-[#f0ebe3]/30 focus:outline-none focus:border-accent transition-colors font-mono disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Claim */}
              <div>
                <label className="block text-sm font-semibold text-[#1c1a17] dark:text-[#f0ebe3] mb-2">
                  Your Claim <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={claim}
                  onChange={e => setClaim(e.target.value)}
                  placeholder="What do you claim about your codebase?"
                  disabled={!isConnected || loading}
                  rows={4}
                  maxLength={500}
                  className="w-full px-4 py-3 rounded-xl border border-[#ddd8ce] dark:border-[#3a3530] bg-[#f0ebe3] dark:bg-[#1a1714] text-[#1c1a17] dark:text-[#f0ebe3] text-sm placeholder:text-[#1c1a17]/30 dark:placeholder:text-[#f0ebe3]/30 focus:outline-none focus:border-accent transition-colors resize-none disabled:opacity-50"
                />
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-[#1c1a17]/40 dark:text-[#f0ebe3]/40">Be specific — validators will evaluate exactly this claim.</span>
                  <span className="text-xs font-mono text-[#1c1a17]/40 dark:text-[#f0ebe3]/40">{claim.length}/500</span>
                </div>
              </div>

              {/* Claim examples */}
              <div>
                <p className="text-xs font-semibold text-[#1c1a17]/50 dark:text-[#f0ebe3]/50 mb-2">Example claims:</p>
                <div className="flex flex-wrap gap-2">
                  {claimExamples.map(ex => (
                    <button
                      key={ex}
                      onClick={() => setClaim(ex)}
                      disabled={!isConnected || loading}
                      className="text-xs px-3 py-1.5 rounded-full border border-[#ddd8ce] dark:border-[#3a3530] hover:border-accent/50 hover:text-accent transition-colors text-[#1c1a17]/60 dark:text-[#f0ebe3]/60 disabled:opacity-50 text-left"
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                </div>
              )}

              {/* Info */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-accent/5 border border-accent/15">
                <FileCheck className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                <p className="text-xs text-[#1c1a17]/60 dark:text-[#f0ebe3]/60 leading-relaxed">
                  Audits may take 2–5 minutes to finalize as validators independently fetch and analyze your repository. The result is stored permanently onchain once consensus is reached.
                </p>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={!isConnected || loading || !repoUrl.trim() || !claim.trim()}
                className="w-full shimmer-btn py-3.5 text-base font-semibold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Running audit — please wait...
                  </>
                ) : (
                  <>
                    <FileCheck className="w-4 h-4" />
                    Submit Audit
                  </>
                )}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
