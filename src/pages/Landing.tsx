import Hero from '@/components/sections/Hero'
import Features from '@/components/sections/Features'
import HowItWorks from '@/components/sections/HowItWorks'
import Stats from '@/components/sections/Stats'
import ChainMarquee from '@/components/sections/ChainMarquee'
import CTA from '@/components/sections/CTA'

export default function Landing() {
  return (
    <main>
      <Hero />
      <Features />
      <HowItWorks />
      <Stats />
      <ChainMarquee />
      <CTA />
    </main>
  )
}
