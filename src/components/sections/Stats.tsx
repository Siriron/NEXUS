import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'

function NumberTicker({ value, suffix = '', duration = 2000 }: { value: number; suffix?: string; duration?: number }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const start = performance.now()
    const tick = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * value))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, value, duration])

  return (
    <span ref={ref} className="tabular-nums">
      {display.toLocaleString()}{suffix}
    </span>
  )
}

const stats = [
  { value: 4, suffix: '', label: 'Validator Nodes', sub: 'Independent consensus' },
  { value: 3, suffix: '', label: 'Verdict Types', sub: 'PASS · FAIL · NEEDS_REVIEW' },
  { value: 10, suffix: '', label: 'Risk Score Scale', sub: '1 = safest · 10 = highest risk' },
  { value: 100, suffix: '%', label: 'Onchain', sub: 'No centralized storage' },
]

export default function Stats() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="py-20 border-y border-[#ddd8ce] dark:border-[#3a3530] bg-[#f7f4ef] dark:bg-[#242018]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="font-display text-5xl sm:text-6xl font-bold text-accent mb-2">
                <NumberTicker value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="font-semibold text-sm text-[#1c1a17] dark:text-[#f0ebe3] mb-1">{stat.label}</div>
              <div className="text-xs text-[#1c1a17]/50 dark:text-[#f0ebe3]/50 font-mono">{stat.sub}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
