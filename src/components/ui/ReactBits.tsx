import { motion, useInView } from 'framer-motion'
import { useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

// ── SplitText ───────────────────────────────────────────────────────

interface SplitTextProps {
  text: string
  className?: string
  delay?: number
  duration?: number
  ease?: string | number[]
  splitType?: 'chars' | 'words'
  from?: object
  to?: object
  threshold?: number
  rootMargin?: string
  textAlign?: 'left' | 'center' | 'right'
}

export function SplitText({
  text,
  className,
  delay = 0,
  duration = 0.6,
  ease = [0.22, 1, 0.36, 1],
  splitType = 'chars',
  from = { opacity: 0, y: 40, filter: 'blur(4px)' },
  to = { opacity: 1, y: 0, filter: 'blur(0px)' },
  threshold = 0.1,
  rootMargin = '-20px',
  textAlign = 'left',
}: SplitTextProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: rootMargin as any })
  const segments = splitType === 'chars' ? text.split('') : text.split(' ')

  return (
    <span
      ref={ref}
      className={cn('inline-block', className)}
      style={{ textAlign }}
    >
      {segments.map((seg, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={from as any}
          animate={(inView ? to : from) as any}
          transition={{
            duration,
            delay: delay + i * (splitType === 'chars' ? 0.03 : 0.06),
            ease,
          }}
        >
          {seg === ' ' ? '\u00A0' : seg}
          {splitType === 'words' && i < segments.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </span>
  )
}

// ── BlurText ────────────────────────────────────────────────────────

interface BlurTextProps {
  text: string
  className?: string
  delay?: number
  duration?: number
  stepDelay?: number
}

export function BlurText({ text, className, delay = 0, duration = 0.5, stepDelay = 0.05 }: BlurTextProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-20px' })
  const words = text.split(' ')

  return (
    <span ref={ref} className={cn('inline-block', className)}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.25em]"
          initial={{ opacity: 0, filter: 'blur(12px)', y: 12 }}
          animate={inView ? { opacity: 1, filter: 'blur(0px)', y: 0 } : {}}
          transition={{
            duration,
            delay: delay + i * stepDelay,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  )
}

// ── ShinyText ───────────────────────────────────────────────────────

interface ShinyTextProps {
  text: string
  className?: string
  shimmerWidth?: number
  speed?: number
  disabled?: boolean
}

export function ShinyText({ text, className, shimmerWidth = 100, speed = 2, disabled = false }: ShinyTextProps) {
  return (
    <span
      className={cn(
        'inline-block bg-clip-text text-transparent',
        !disabled && 'animate-shining',
        className
      )}
      style={{
        backgroundImage: 'linear-gradient(120deg, #2a6049 40%, #a8d5c4 50%, #2a6049 60%)',
        backgroundSize: `${shimmerWidth}% 100%`,
        WebkitBackgroundClip: 'text',
        animation: disabled ? 'none' : `shining ${speed}s linear infinite`,
      }}
    >
      {text}
      <style>{`
        @keyframes shining {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
      `}</style>
    </span>
  )
}

// ── Magnet (hover pull effect) ──────────────────────────────────────

interface MagnetProps {
  children: ReactNode
  className?: string
  strength?: number
}

export function Magnet({ children, className, strength = 0.3 }: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) * strength
    const dy = (e.clientY - cy) * strength
    ref.current.style.transform = `translate(${dx}px, ${dy}px)`
  }

  const handleMouseLeave = () => {
    if (!ref.current) return
    ref.current.style.transform = 'translate(0,0)'
    ref.current.style.transition = 'transform 0.5s ease'
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn('inline-block', className)}
      style={{ transition: 'transform 0.1s ease' }}
    >
      {children}
    </div>
  )
}
