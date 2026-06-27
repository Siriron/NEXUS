import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ExternalLink } from 'lucide-react'
import { useWallet } from '@/hooks/useWallet'
import { cn } from '@/lib/utils'
import { EXPLORER_TX_URL, DEPLOY_TX } from '@/config/chains'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { address, shortAddress, isConnected, isConnecting, connect } = useWallet()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [location.pathname])

  const navLinks = [
    { href: '/submit', label: 'Submit Audit' },
    { href: '/registry', label: 'Registry' },
    { href: '/my-audits', label: 'My Audits' },
    { href: '/docs', label: 'Docs' },
  ]

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-[#f0ebe3]/90 dark:bg-[#1a1714]/90 backdrop-blur-md border-b border-[#ddd8ce] dark:border-[#3a3530]'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center transition-transform group-hover:scale-105">
              <svg viewBox="0 0 48 48" fill="none" className="w-5 h-5">
                <path d="M12 14 L20 14 L28 34 L36 34" stroke="#f0ebe3" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M36 14 L28 14 L20 34 L12 34" stroke="#f0ebe3" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
                <circle cx="24" cy="24" r="3" fill="#f0ebe3"/>
              </svg>
            </div>
            <span className="font-display font-bold text-lg text-[#1c1a17] dark:text-[#f0ebe3] tracking-wide">
              NEXUS
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'text-sm font-medium transition-colors duration-200',
                  location.pathname === link.href
                    ? 'text-accent'
                    : 'text-[#1c1a17]/70 dark:text-[#f0ebe3]/70 hover:text-[#1c1a17] dark:hover:text-[#f0ebe3]'
                )}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`${EXPLORER_TX_URL}/${DEPLOY_TX}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-[#1c1a17]/50 dark:text-[#f0ebe3]/50 hover:text-accent transition-colors flex items-center gap-1"
            >
              Contract <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Connect wallet */}
          <div className="hidden md:flex items-center gap-3">
            {isConnected ? (
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#ddd8ce] dark:border-[#3a3530] bg-[#f7f4ef] dark:bg-[#242018]">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse-slow" />
                <span className="text-sm font-mono text-[#1c1a17] dark:text-[#f0ebe3]">{shortAddress}</span>
              </div>
            ) : (
              <button
                onClick={connect}
                disabled={isConnecting}
                className="shimmer-btn px-5 py-2.5 text-sm font-semibold rounded-lg disabled:opacity-60"
              >
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-[#f7f4ef] dark:hover:bg-[#242018] transition-colors"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#f0ebe3] dark:bg-[#1a1714] border-b border-[#ddd8ce] dark:border-[#3a3530]"
          >
            <div className="px-4 py-4 flex flex-col gap-4">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    'text-sm font-medium py-2',
                    location.pathname === link.href ? 'text-accent' : 'text-[#1c1a17]/70 dark:text-[#f0ebe3]/70'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              {!isConnected && (
                <button
                  onClick={connect}
                  disabled={isConnecting}
                  className="shimmer-btn px-5 py-2.5 text-sm font-semibold rounded-lg text-center"
                >
                  {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                </button>
              )}
              {isConnected && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#ddd8ce] dark:border-[#3a3530] bg-[#f7f4ef] dark:bg-[#242018] w-fit">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <span className="text-sm font-mono">{shortAddress}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
