import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink, Github } from 'lucide-react'
import { NETWORKS, getActiveNetwork, getContractAddress, getExplorerTxUrl, getDeployTx, onNetworkChange, NetworkKey } from '@/config/chains'

export default function Footer() {
  const [network, setNetwork] = useState<NetworkKey>(getActiveNetwork())
  const [address, setAddress] = useState(getContractAddress())

  useEffect(() => onNetworkChange((n) => {
    setNetwork(n)
    setAddress(getContractAddress())
  }), [])

  const shortAddr = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'not deployed'
  const cfg = NETWORKS[network]

  return (
    <footer className="border-t border-[#ddd8ce] dark:border-[#3a3530] bg-[#f7f4ef] dark:bg-[#242018]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <svg viewBox="0 0 48 48" fill="none" className="w-5 h-5">
                  <path d="M12 14 L20 14 L28 34 L36 34" stroke="#f0ebe3" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M36 14 L28 14 L20 34 L12 34" stroke="#f0ebe3" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
                  <circle cx="24" cy="24" r="3" fill="#f0ebe3"/>
                </svg>
              </div>
              <span className="font-display font-bold text-lg tracking-wide">NEXUS</span>
            </div>
            <p className="text-sm text-[#1c1a17]/60 dark:text-[#f0ebe3]/60 max-w-xs leading-relaxed">
              AI-native onchain code audit protocol. Submit any GitHub repository and get a verifiable, consensus-backed audit result — permanently onchain.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a
                href="https://github.com/Siriron/NEXUS"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-[#1c1a17]/60 dark:text-[#f0ebe3]/60 hover:text-accent transition-colors"
              >
                <Github className="w-4 h-4" /> GitHub
              </a>
              <a
                href={`${getExplorerTxUrl()}/${getDeployTx()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-[#1c1a17]/60 dark:text-[#f0ebe3]/60 hover:text-accent transition-colors"
              >
                <ExternalLink className="w-4 h-4" /> Explorer
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-[#1c1a17] dark:text-[#f0ebe3]">Protocol</h4>
            <ul className="space-y-2.5">
              {[
                { to: '/submit', label: 'Submit Audit' },
                { to: '/registry', label: 'Public Registry' },
                { to: '/my-audits', label: 'My Audits' },
                { to: '/docs', label: 'Documentation' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-[#1c1a17]/60 dark:text-[#f0ebe3]/60 hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contract */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-[#1c1a17] dark:text-[#f0ebe3]">On-Chain</h4>
            <ul className="space-y-2.5">
              <li>
                <span className="text-xs text-[#1c1a17]/40 dark:text-[#f0ebe3]/40 block mb-1">Network</span>
                <span className="text-sm font-mono text-[#1c1a17]/70 dark:text-[#f0ebe3]/70">{cfg.chainName}</span>
              </li>
              <li>
                <span className="text-xs text-[#1c1a17]/40 dark:text-[#f0ebe3]/40 block mb-1">Contract</span>
                <a
                  href={`${cfg.explorerUrl}/address/${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-mono text-accent hover:underline"
                >
                  {shortAddr}
                </a>
              </li>
              <li>
                <span className="text-xs text-[#1c1a17]/40 dark:text-[#f0ebe3]/40 block mb-1">Chain ID</span>
                <span className="text-sm font-mono text-[#1c1a17]/70 dark:text-[#f0ebe3]/70">{cfg.chainId}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#ddd8ce] dark:border-[#3a3530] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#1c1a17]/40 dark:text-[#f0ebe3]/40">
            © 2026 NEXUS Protocol. Built on GenLayer.
          </p>
          <p className="text-xs text-[#1c1a17]/40 dark:text-[#f0ebe3]/40">
            Powered by Optimistic Democracy consensus
          </p>
        </div>
      </div>
    </footer>
  )
}
