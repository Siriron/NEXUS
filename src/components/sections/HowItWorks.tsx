import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { Upload, Search, GitMerge, CheckCircle } from 'lucide-react'

const steps = [
  {
    icon: Upload,
    number: '01',
    title: 'Submit Your Repository',
    description: 'Connect your MetaMask wallet and submit a GitHub repository URL along with a specific claim about your codebase — e.g. "This contract has no reentrancy vulnerabilities" or "All functions are documented."',
    detail: 'One transaction triggers the full audit pipeline.',
  },
  {
    icon: Search,
    number: '02',
    title: 'Validators Fetch Evidence',
    description: 'GenLayer\'s leader validator fetches your README and source files directly from GitHub raw URLs. It then constructs a structured prompt using your claim as the evaluation criterion.',
    detail: 'Prompt injection hardened with BEGIN/END markers.',
  },
  {
    icon: GitMerge,
    number: '03',
    title: 'Independent Consensus',
    description: 'Multiple validator nodes independently re-fetch the same files and re-run the analysis. They compare verdicts and risk scores — consensus is required before the result is finalized.',
    detail: 'Optimistic Democracy: ±2 risk score tolerance.',
  },
  {
    icon: CheckCircle,
    number: '04',
    title: 'Result Stored Onchain',
    description: 'The final verdict (PASS / FAIL / NEEDS_REVIEW), risk score (1–10), specific findings, and summary are written permanently to the GenLayer Intelligent Contract.',
    detail: 'Immutable. Queryable. Forever.',
  },
]

export default function HowItWorks() {
  const sectionRef = useRef(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-80px' })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start center', 'end center'],
  })

  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section ref={sectionRef} className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-20"
      >
        <span className="text-xs font-semibold tracking-widest text-accent uppercase mb-4 block">
          How It Works
        </span>
        <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#1c1a17] dark:text-[#f0ebe3] mb-4">
          From repo URL to
          <br />onchain verdict
        </h2>
        <p className="text-[#1c1a17]/60 dark:text-[#f0ebe3]/60 max-w-lg mx-auto">
          Four steps. One transaction. A permanent audit record that lives on the blockchain.
        </p>
      </motion.div>

      <div className="relative">
        {/* Tracing beam line */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-[#ddd8ce] dark:bg-[#3a3530] md:-translate-x-1/2 hidden sm:block">
          <motion.div
            className="w-full bg-gradient-to-b from-accent/80 to-accent/20 origin-top"
            style={{ height: lineHeight }}
          />
          {/* Moving dot */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-accent shadow-lg shadow-accent/40"
            style={{ top: lineHeight }}
          />
        </div>

        <div className="space-y-16">
          {steps.map((step, i) => {
            const Icon = step.icon
            const isRight = i % 2 === 1

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: isRight ? 40 : -40 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                className={`relative flex items-center gap-8 md:gap-16 ${isRight ? 'md:flex-row-reverse' : 'md:flex-row'} flex-row`}
              >
                {/* Step content */}
                <div className={`flex-1 ${isRight ? 'md:text-right' : 'md:text-left'} pl-16 sm:pl-0`}>
                  <div className="inline-flex items-center gap-2 mb-3">
                    <span className="font-mono text-xs font-bold text-accent/60 tracking-widest">{step.number}</span>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-[#1c1a17] dark:text-[#f0ebe3] mb-3">
                    {step.title}
                  </h3>
                  <p className="text-[#1c1a17]/60 dark:text-[#f0ebe3]/60 leading-relaxed mb-3">
                    {step.description}
                  </p>
                  <span className="inline-block text-xs font-mono text-accent bg-accent/8 px-3 py-1.5 rounded-full border border-accent/20">
                    {step.detail}
                  </span>
                </div>

                {/* Center icon node */}
                <div className="absolute left-0 sm:relative sm:left-auto flex-shrink-0 z-10">
                  <div className="w-16 h-16 rounded-2xl bg-[#f7f4ef] dark:bg-[#242018] border-2 border-[#ddd8ce] dark:border-[#3a3530] flex items-center justify-center shadow-sm group-hover:border-accent/40 transition-colors">
                    <Icon className="w-7 h-7 text-accent" />
                  </div>
                </div>

                {/* Spacer for opposite side */}
                <div className="flex-1 hidden md:block" />
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
