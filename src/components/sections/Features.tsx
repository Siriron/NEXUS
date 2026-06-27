import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { Brain, GitBranch, Shield, Zap, Lock, Globe } from 'lucide-react'
import { WobbleCard } from '@/components/ui/WobbleCard'
import { AnimatedGroup } from '@/components/ui/MotionPrimitives'
import { BlurText } from '@/components/ui/ReactBits'

const features = [
  {
    icon: Brain,
    title: 'AI Validators',
    description: 'Multiple independent GenLayer validators fetch your repository and analyze your claim simultaneously — no single point of failure, no human bias.',
    size: 'large',
    dark: true,
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
    description: 'All user inputs are wrapped in BEGIN/END markers and truncated — injection-resistant by design.',
    size: 'small',
  },
  {
    icon: Zap,
    title: 'Single Transaction',
    description: 'One write call triggers the full nondet audit pipeline — fetch, analyze, consensus, store.',
    size: 'small',
  },
  {
    icon: Lock,
    title: 'Immutable Records',
    description: 'Every audit result is stored permanently. No deletions, no edits, no admin backdoors.',
    size: 'small',
  },
  {
    icon: Globe,
    title: 'Public Registry',
    description: 'All completed audits are publicly queryable. Build trust by pointing users to your onchain audit record.',
    size: 'medium',
  },
]

export default function Features() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <span className="text-xs font-semibold tracking-widest text-accent uppercase mb-4 block">Why NEXUS</span>
        <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#1c1a17] dark:text-[#f0ebe3] mb-4">
          <BlurText
            text="Audit infrastructure built for the onchain era"
            duration={0.5}
            stepDelay={0.04}
          />
        </h2>
        <p className="text-[#1c1a17]/60 dark:text-[#f0ebe3]/60 max-w-xl mx-auto">
          Every layer of NEXUS is designed for verifiability — from how evidence is fetched to how consensus is reached.
        </p>
      </div>

      {/* Bento grid using WobbleCards */}
      <AnimatedGroup preset="slide-up" className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {features.map((f) => {
          const Icon = f.icon
          const colSpan = f.size === 'large' ? 'md:col-span-2 md:row-span-2' : f.size === 'medium' ? 'md:col-span-2' : ''

          return (
            <WobbleCard
              key={f.title}
              containerClassName={`${colSpan} ${f.dark ? 'bg-accent' : 'bg-[#f7f4ef] dark:bg-[#242018]'} border ${f.dark ? 'border-accent' : 'border-[#ddd8ce] dark:border-[#3a3530]'} overflow-hidden`}
              className="p-6 h-full"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${f.dark ? 'bg-white/20' : 'bg-accent/10'}`}>
                <Icon className={`w-5 h-5 ${f.dark ? 'text-white' : 'text-accent'}`} />
              </div>
              <h3 className={`font-display font-bold text-xl mb-2 ${f.dark ? 'text-white' : 'text-[#1c1a17] dark:text-[#f0ebe3]'}`}>
                {f.title}
              </h3>
              <p className={`text-sm leading-relaxed ${f.dark ? 'text-white/80' : 'text-[#1c1a17]/60 dark:text-[#f0ebe3]/60'}`}>
                {f.description}
              </p>
            </WobbleCard>
          )
        })}
      </AnimatedGroup>
    </section>
  )
}
