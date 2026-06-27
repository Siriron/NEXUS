import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { Upload, Search, GitMerge, CheckCircle } from 'lucide-react'
import { TracingBeam } from '@/components/ui/TracingBeam'
import { InView } from '@/components/ui/MotionPrimitives'
import { BlurText } from '@/components/ui/ReactBits'

const steps = [
  {
    icon: Upload,
    number: '01',
    title: 'Submit Your Repository',
    description: 'Connect your MetaMask wallet to GenLayer Studio and submit a GitHub repository URL alongside a specific claim about your codebase — e.g. "This contract has no reentrancy vulnerabilities."',
    tag: 'One transaction triggers the full pipeline.',
  },
  {
    icon: Search,
    number: '02',
    title: 'Validators Fetch Evidence',
    description: 'The leader validator fetches your README and source files directly from GitHub raw URLs, then constructs a structured, injection-hardened prompt using your claim as the evaluation criterion.',
    tag: 'BEGIN/END prompt injection hardening.',
  },
  {
    icon: GitMerge,
    number: '03',
    title: 'Independent Consensus',
    description: 'Multiple validator nodes independently re-fetch the same files and re-run the analysis. They compare verdicts and risk scores — full consensus is required before the result is finalized.',
    tag: 'Optimistic Democracy: ±2 risk score tolerance.',
  },
  {
    icon: CheckCircle,
    number: '04',
    title: 'Result Stored Onchain',
    description: 'The final verdict (PASS / FAIL / NEEDS_REVIEW), risk score (1–10), specific findings, and summary are written permanently to the GenLayer Intelligent Contract. Immutable. Forever.',
    tag: 'Queryable by anyone, anytime.',
  },
]

export default function HowItWorks() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="text-center mb-20">
        <span className="text-xs font-semibold tracking-widest text-accent uppercase mb-4 block">How It Works</span>
        <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#1c1a17] dark:text-[#f0ebe3] mb-4">
          <BlurText text="From repo URL to onchain verdict" stepDelay={0.04} />
        </h2>
        <p className="text-[#1c1a17]/60 dark:text-[#f0ebe3]/60 max-w-lg mx-auto">
          Four steps. One transaction. A permanent audit record on the blockchain.
        </p>
      </div>

      <TracingBeam className="px-6">
        <div className="space-y-16 max-w-2xl">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <InView
                key={step.number}
                variants={{
                  hidden: { opacity: 0, x: -32 },
                  visible: { opacity: 1, x: 0 },
                }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex gap-6 items-start">
                  {/* Icon node */}
                  <div className="shrink-0 w-14 h-14 rounded-2xl bg-[#f7f4ef] dark:bg-[#242018] border-2 border-[#ddd8ce] dark:border-[#3a3530] flex items-center justify-center shadow-sm">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>

                  {/* Content */}
                  <div className="pt-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-xs font-bold text-accent/50 tracking-widest">{step.number}</span>
                    </div>
                    <h3 className="font-display text-2xl font-bold text-[#1c1a17] dark:text-[#f0ebe3] mb-3">
                      {step.title}
                    </h3>
                    <p className="text-[#1c1a17]/60 dark:text-[#f0ebe3]/60 leading-relaxed mb-3">
                      {step.description}
                    </p>
                    <span className="inline-block text-xs font-mono text-accent bg-accent/8 px-3 py-1.5 rounded-full border border-accent/20">
                      {step.tag}
                    </span>
                  </div>
                </div>
              </InView>
            )
          })}
        </div>
      </TracingBeam>
    </section>
  )
}
