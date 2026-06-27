import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { NumberTicker } from '@/components/ui/NumberTicker'
import { AnimatedGroup } from '@/components/ui/MotionPrimitives'

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
        <AnimatedGroup preset="fade" className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-5xl sm:text-6xl font-bold text-accent mb-2">
                <NumberTicker
                  value={stat.value}
                  suffix={stat.suffix}
                  className="font-display text-5xl sm:text-6xl font-bold text-accent"
                />
              </div>
              <div className="font-semibold text-sm text-[#1c1a17] dark:text-[#f0ebe3] mb-1">{stat.label}</div>
              <div className="text-xs text-[#1c1a17]/50 dark:text-[#f0ebe3]/50 font-mono">{stat.sub}</div>
            </div>
          ))}
        </AnimatedGroup>
      </div>
    </section>
  )
}
