import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const items = [
  '⬡ GenLayer Intelligent Contracts',
  '🔍 AI-Native Auditing',
  '✦ Optimistic Democracy',
  '⬡ StudioNet Chain 61999',
  '🛡 Prompt Injection Hardened',
  '✦ GitHub Raw API',
  '⬡ Immutable Audit Records',
  '🔍 Consensus Validated',
  '✦ Zero Financial Mechanics',
  '⬡ Open Source',
]

function MarqueeRow({ reverse = false }: { reverse?: boolean }) {
  const doubled = [...items, ...items]
  return (
    <div className="flex overflow-hidden">
      <div
        className={`flex gap-8 whitespace-nowrap ${reverse ? 'animate-marquee2' : 'animate-marquee'}`}
        style={{ animationDuration: '30s' }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#1c1a17]/50 dark:text-[#f0ebe3]/50 px-4 py-2 rounded-full border border-[#ddd8ce] dark:border-[#3a3530] bg-[#f7f4ef] dark:bg-[#242018] shrink-0"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function ChainMarquee() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="py-20 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
        className="space-y-4"
      >
        <MarqueeRow />
        <MarqueeRow reverse />
      </motion.div>
    </section>
  )
}
