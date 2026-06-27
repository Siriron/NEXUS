import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ShieldCheck, GitBranch, Cpu } from 'lucide-react'
import { Spotlight } from '@/components/ui/Spotlight'
import { ShimmerButton } from '@/components/ui/ShimmerButton'
import { SplitText } from '@/components/ui/ReactBits'
import { ShinyText } from '@/components/ui/ReactBits'
import { InView } from '@/components/ui/MotionPrimitives'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Spotlight */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="rgba(42,96,73,0.18)" />
      </div>

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#1c1a17 1px, transparent 1px), linear-gradient(90deg, #1c1a17 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-accent/8 blur-3xl animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/3 w-56 h-56 rounded-full bg-accent/6 blur-3xl pointer-events-none" style={{ animation: 'float 7s ease-in-out infinite' }} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <InView viewOptions={{ once: true, margin: '0px' }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/25 bg-accent/8 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-semibold text-accent tracking-widest uppercase">Built on GenLayer</span>
          </div>
        </InView>

        {/* Headline — SplitText per word */}
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-[#1c1a17] dark:text-[#f0ebe3] leading-[1.06] mb-4 tracking-tight">
          <SplitText
            text="Code Audits."
            splitType="words"
            delay={0.1}
            duration={0.7}
            from={{ opacity: 0, y: 48, filter: 'blur(6px)' }}
            to={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          />
          <br />
          <ShinyText
            text="Verifiable. Permanent."
            shimmerWidth={200}
            speed={3}
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold"
          />
        </h1>

        {/* Subheadline — BlurText */}
        <InView
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10"
        >
          <p className="text-lg sm:text-xl text-[#1c1a17]/60 dark:text-[#f0ebe3]/60 max-w-2xl mx-auto leading-relaxed">
            Submit any GitHub repository with a claim about your codebase.
            GenLayer AI validators independently fetch, analyze, and reach consensus —
            delivering a verifiable audit result stored permanently onchain.
          </p>
        </InView>

        {/* CTAs */}
        <InView
          variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link to="/submit">
            <ShimmerButton className="px-8 py-3.5 text-base gap-2 group">
              Submit Your Repo
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </ShimmerButton>
          </Link>
          <Link to="/registry">
            <button className="px-8 py-3.5 text-base font-semibold rounded-[10px] border border-[#ddd8ce] dark:border-[#3a3530] hover:border-accent/50 text-[#1c1a17] dark:text-[#f0ebe3] bg-[#f7f4ef] dark:bg-[#242018] transition-all hover:bg-accent/5">
              View Registry
            </button>
          </Link>
        </InView>

        {/* Trust indicators */}
        <InView
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          transition={{ duration: 0.5, delay: 0.9 }}
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
        </InView>
      </div>

      {/* Scroll beam */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="w-px h-14 bg-gradient-to-b from-transparent via-accent/40 to-transparent animate-beam" />
      </motion.div>
    </section>
  )
}
