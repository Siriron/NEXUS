import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { GitBranch, Brain, Shield, Zap, Lock, Globe } from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'AI Validators',
    description: 'Multiple independent GenLayer validators fetch your repository and analyze your claim simultaneously — no single point of failure.',
    size: 'large',
    accent: true,
  },
  {
    icon: GitBranch,
    title: 'GitHub Native',
    description: 'Validators scrape your README and source files directly from GitHub raw URLs. No uploads, no intermediaries.',
    size: 'small',
  },
  {
    icon: Shield,
    title: 'Prompt Hardened',
    description: 'All user inputs are wrapped in BEGIN/END markers and truncated before reaching the LLM — injection-resistant by design.',
    size: 'small',
  },
  {
    icon: Zap,
    title: 'Single Transaction',
    description: 'One write call triggers the full nondet audit pipeline — fetch, analyze, reach consensus, store result onchain.',
    size: 'small',
  },
  {
    icon: Lock,
    title: 'Immutable Records',
    description: 'Every audit result is stored permanently in a GenLayer Intelligent Contract. No deletions, no edits, no admin backdoors.',
    size: 'small',
  },
  {
    icon: Globe,
    title: 'Public Registry',
    description: 'All completed audits are publicly queryable. Build trust with your users by pointing them to your onchain audit record.',
    size: 'medium',
  },
]

export default function Features() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <span className="text-xs font-semibold tracking-widest text-accent uppercase mb-4 block">
          Why NEXUS
        </span>
        <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#1c1a17] dark:text-[#f0ebe3] mb-4">
          Audit infrastructure built
          <br />for the onchain era
        </h2>
        <p className="text-[#1c1a17]/60 dark:text-[#f0ebe3]/60 max-w-xl mx-auto">
          Every layer of NEXUS is designed for verifiability — from how evidence is fetched to how consensus is reached.
        </p>
      </motion.div>

      {/* Bento grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {features.map((f, i) => {
          const Icon = f.icon
          const colSpan = f.size === 'large' ? 'md:col-span-2 md:row-span-2' : f.size === 'medium' ? 'md:col-span-2' : ''

          return (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={`
                relative group rounded-2xl p-6 border card-hover bento-glow overflow-hidden
                ${f.accent
                  ? 'bg-accent text-white border-accent'
                  : 'bg-[#f7f4ef] dark:bg-[#242018] border-[#ddd8ce] dark:border-[#3a3530]'
                }
                ${colSpan}
              `}
            >
              {f.accent && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
              )}
              <div className={`
                w-10 h-10 rounded-xl flex items-center justify-center mb-4
                ${f.accent ? 'bg-white/20' : 'bg-accent/10'}
              `}>
                <Icon className={`w-5 h-5 ${f.accent ? 'text-white' : 'text-accent'}`} />
              </div>
              <h3 className={`font-display font-bold text-xl mb-2 ${f.accent ? 'text-white' : 'text-[#1c1a17] dark:text-[#f0ebe3]'}`}>
                {f.title}
              </h3>
              <p className={`text-sm leading-relaxed ${f.accent ? 'text-white/80' : 'text-[#1c1a17]/60 dark:text-[#f0ebe3]/60'}`}>
                {f.description}
              </p>

              {/* Animated beam for large card */}
              {f.accent && (
                <div className="absolute bottom-0 left-0 right-0 h-px overflow-hidden">
                  <div className="h-px w-1/3 bg-white/40 animated-beam" />
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
