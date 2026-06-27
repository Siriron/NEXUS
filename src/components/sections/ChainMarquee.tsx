import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { Marquee } from '@/components/ui/Marquee'
import { InView } from '@/components/ui/MotionPrimitives'

const row1 = [
  { text: '⬡ GenLayer Intelligent Contracts' },
  { text: '🔍 AI-Native Auditing' },
  { text: '✦ Optimistic Democracy' },
  { text: '⬡ StudioNet Chain 61999' },
  { text: '🛡 Prompt Injection Hardened' },
  { text: '✦ GitHub Raw API' },
]

const row2 = [
  { text: '⬡ Immutable Audit Records' },
  { text: '🔍 Consensus Validated' },
  { text: '✦ Zero Financial Mechanics' },
  { text: '⬡ Open Source' },
  { text: '🛡 Single Transaction Audit' },
  { text: '✦ Bradbury Testnet Ready' },
]

function MarqueeItem({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm font-medium text-[#1c1a17]/60 dark:text-[#f0ebe3]/60 px-4 py-2 rounded-full border border-[#ddd8ce] dark:border-[#3a3530] bg-[#f7f4ef] dark:bg-[#242018] mx-2 whitespace-nowrap select-none">
      {text}
    </span>
  )
}

export default function ChainMarquee() {
  return (
    <section className="py-20 overflow-hidden">
      <InView
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        transition={{ duration: 0.8 }}
        className="space-y-4"
      >
        <Marquee pauseOnHover speed={35} repeat={2}>
          {row1.map((item, i) => <MarqueeItem key={i} text={item.text} />)}
        </Marquee>
        <Marquee pauseOnHover reverse speed={35} repeat={2}>
          {row2.map((item, i) => <MarqueeItem key={i} text={item.text} />)}
        </Marquee>
      </InView>
    </section>
  )
}
