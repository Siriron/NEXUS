import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ShieldCheck, GitBranch, Cpu } from 'lucide-react'

const WORDS = ['Verifiable.', 'Trustless.', 'Permanent.']

export default function Hero() {
  const wordRef = useRef<HTMLSpanElement>(null)
  const wordIndex = useRef(0)

  useEffect(() => {
    const el = wordRef.current
    if (!el) return
    const cycle = () => {
      el.style.opacity = '0'
      el.style.transform = 'translateY(8px)'
      setTimeout(() => {
        wordIndex.current = (wordIndex.current + 1) % WORDS.length
        el.textContent = WORDS[wordIndex.current]
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease'
        el.style.opacity = '1'
        el.style.transform = 'translateY(0)'
      }, 300)
    }
    el.textContent = WORDS[0]
    el.style.opacity = '1'
    const interval = setInterval(cycle, 2800)
    return () => clearInterval(interval)
  }, [])

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
  }
  const item = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Spotlight background */}
      <div className="spotlight" />
      <div className="absolute inset-0 bg-gradient-radial from-accent/[0.07] via-transparent to-transparent" />

      {/* Animated grid */}
      <div
        className="absolute inset-0 opacity-[0.035] dark:opacity-[0.06]"
        style={{
          backgroundImage: `linear-gradient(#1c1a17 1px, transparent 1px), linear-gradient(90deg, #1c1a17 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-accent/10 blur-3xl animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-accent/8 blur-3xl animate-float pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div variants={container} initial="hidden" animate="show">
          {/* Badge */}
          <motion.div variants={item} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/30 bg-accent/8 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-semibold text-accent tracking-widest uppercase">Built on GenLayer</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={item}
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-[#1c1a17] dark:text-[#f0ebe3] leading-[1.05] mb-6 tracking-tight"
          >
            Code Audits.
            <br />
            <span className="text-accent">
              <span
                ref={wordRef}
                style={{
                  display: 'inline-block',
                  transition: 'opacity 0.3s ease, transform 0.3s ease',
                  opacity: 0,
                }}
              />
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={item}
            className="text-lg sm:text-xl text-[#1c1a17]/60 dark:text-[#f0ebe3]/60 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Submit any GitHub repository with a claim about your codebase.
            GenLayer AI validators independently fetch, analyze, and reach consensus —
            delivering a verifiable audit result stored permanently onchain.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link to="/submit">
              <button className="shimmer-btn px-8 py-3.5 text-base font-semibold rounded-xl flex items-center gap-2 group">
                Submit Your Repo
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </Link>
            <Link to="/registry">
              <button className="px-8 py-3.5 text-base font-semibold rounded-xl border border-[#ddd8ce] dark:border-[#3a3530] hover:border-accent/50 text-[#1c1a17] dark:text-[#f0ebe3] bg-[#f7f4ef] dark:bg-[#242018] transition-all hover:bg-accent/5">
                View Registry
              </button>
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            variants={item}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-[#1c1a17]/50 dark:text-[#f0ebe3]/50"
          >
            {[
              { icon: ShieldCheck, label: 'Zero financial mechanics' },
              { icon: GitBranch, label: 'GitHub native' },
              { icon: Cpu, label: 'Optimistic Democracy consensus' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-accent" />
                <span>{label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-accent/40 to-transparent animate-beam" />
        </motion.div>
      </div>
    </section>
  )
}
