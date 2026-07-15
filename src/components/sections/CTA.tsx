import { Link } from 'react-router-dom'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { ShimmerButton } from '@/components/ui/ShimmerButton'
import { SpotlightCard } from '@/components/ui/Spotlight'
import { InView } from '@/components/ui/MotionPrimitives'
import { ShinyText } from '@/components/ui/ReactBits'
import { Magnet } from '@/components/ui/ReactBits'
import { getExplorerTxUrl, getDeployTx } from '@/config/chains'

export default function CTA() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <InView
          variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <SpotlightCard className="border border-[#ddd8ce] dark:border-[#3a3530] bg-[#f7f4ef] dark:bg-[#242018]">
            <div className="p-12 md:p-16 text-center relative overflow-hidden">
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-accent/12 to-transparent rounded-tl-2xl pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-accent/8 to-transparent rounded-br-2xl pointer-events-none" />

              {/* Animated beam bottom */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px overflow-hidden">
                <div
                  className="h-px w-1/4 bg-accent/50"
                  style={{ animation: 'shimmerMove 3s linear infinite' }}
                />
              </div>

              <div className="relative z-10">
                <span className="text-xs font-semibold tracking-widest text-accent uppercase mb-6 block">
                  Start Auditing
                </span>
                <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#1c1a17] dark:text-[#f0ebe3] mb-4">
                  Your code deserves a{' '}
                  <ShinyText text="verifiable record" shimmerWidth={220} speed={2.5} className="font-display text-4xl sm:text-5xl font-bold" />
                </h2>
                <p className="text-[#1c1a17]/60 dark:text-[#f0ebe3]/60 max-w-lg mx-auto mb-10 leading-relaxed">
                  Stop relying on self-reported security claims. Submit your repository to NEXUS and get an AI-consensus audit result that lives onchain forever.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Magnet strength={0.2}>
                    <Link to="/submit">
                      <ShimmerButton className="px-8 py-3.5 text-base gap-2 group">
                        Submit Your Repo
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </ShimmerButton>
                    </Link>
                  </Magnet>
                  <a
                    href={`${getExplorerTxUrl()}/${getDeployTx()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-3.5 text-base font-semibold rounded-[10px] border border-[#ddd8ce] dark:border-[#3a3530] hover:border-accent/50 text-[#1c1a17] dark:text-[#f0ebe3] transition-all hover:bg-accent/5 flex items-center gap-2"
                  >
                    View Contract <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </SpotlightCard>
        </InView>
      </div>
    </section>
  )
}
