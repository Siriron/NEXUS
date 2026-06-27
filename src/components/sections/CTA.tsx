import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { EXPLORER_TX_URL, DEPLOY_TX } from '@/config/chains'

export default function CTA() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto relative">
        {/* Spotlight */}
        <div className="absolute inset-0 bg-gradient-radial from-accent/12 via-transparent to-transparent rounded-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl border border-[#ddd8ce] dark:border-[#3a3530] bg-[#f7f4ef] dark:bg-[#242018] p-12 md:p-16 text-center overflow-hidden"
        >
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-accent/15 to-transparent rounded-tl-3xl" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-accent/10 to-transparent rounded-br-3xl" />

          {/* Beam bottom */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px overflow-hidden">
            <div className="h-px w-1/3 bg-accent/50 animated-beam" />
          </div>

          <div className="relative z-10">
            <span className="text-xs font-semibold tracking-widest text-accent uppercase mb-6 block">
              Start Auditing
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#1c1a17] dark:text-[#f0ebe3] mb-4">
              Your code deserves
              <br />a verifiable record
            </h2>
            <p className="text-[#1c1a17]/60 dark:text-[#f0ebe3]/60 max-w-lg mx-auto mb-10 leading-relaxed">
              Stop relying on self-reported security claims. Submit your repository to NEXUS and get an AI-consensus audit result that lives onchain forever.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/submit">
                <button className="shimmer-btn px-8 py-3.5 text-base font-semibold rounded-xl flex items-center gap-2 group">
                  Submit Your Repo
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
              <a
                href={`${EXPLORER_TX_URL}/${DEPLOY_TX}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 text-base font-semibold rounded-xl border border-[#ddd8ce] dark:border-[#3a3530] hover:border-accent/50 text-[#1c1a17] dark:text-[#f0ebe3] bg-transparent transition-all hover:bg-accent/5 flex items-center gap-2"
              >
                View Contract <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
