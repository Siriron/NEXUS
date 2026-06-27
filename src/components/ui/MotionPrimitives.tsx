import { motion, useInView, type Variants } from 'framer-motion'
import { useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

// ── Text Effect (word/char blur-in reveal) ──────────────────────────

type TextEffectPreset = 'blur' | 'fade-in-blur' | 'slide' | 'scale'

const presetVariants: Record<TextEffectPreset, { container: Variants; item: Variants }> = {
  blur: {
    container: { hidden: {}, visible: { transition: { staggerChildren: 0.04 } } },
    item: {
      hidden: { opacity: 0, filter: 'blur(10px)' },
      visible: { opacity: 1, filter: 'blur(0px)', transition: { duration: 0.4, ease: 'easeOut' } },
    },
  },
  'fade-in-blur': {
    container: { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } },
    item: {
      hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
      visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
    },
  },
  slide: {
    container: { hidden: {}, visible: { transition: { staggerChildren: 0.04 } } },
    item: {
      hidden: { opacity: 0, y: 24 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
    },
  },
  scale: {
    container: { hidden: {}, visible: { transition: { staggerChildren: 0.04 } } },
    item: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
    },
  },
}

interface TextEffectProps {
  children: string
  preset?: TextEffectPreset
  as?: keyof JSX.IntrinsicElements
  className?: string
  segmentClassName?: string
  per?: 'word' | 'char'
  delay?: number
  trigger?: boolean
}

export function TextEffect({
  children,
  preset = 'fade-in-blur',
  as: Tag = 'p',
  className,
  segmentClassName,
  per = 'word',
  delay = 0,
  trigger = true,
}: TextEffectProps) {
  const segments = per === 'char' ? children.split('') : children.split(' ')
  const { container, item } = presetVariants[preset]

  const containerVariants: Variants = {
    ...container,
    visible: {
      ...(container.visible as object),
      transition: {
        staggerChildren: per === 'char' ? 0.03 : 0.06,
        delayChildren: delay,
      },
    },
  }

  return (
    <motion.div
      initial="hidden"
      animate={trigger ? 'visible' : 'hidden'}
      variants={containerVariants}
      className={cn('flex flex-wrap', per === 'word' && 'gap-x-[0.25em]')}
    >
      {/* @ts-ignore */}
      <Tag className={cn('flex flex-wrap', per === 'word' && 'gap-x-[0.25em]', className)}>
        {segments.map((seg, i) => (
          <motion.span key={i} variants={item} className={cn('inline-block', segmentClassName)}>
            {seg}{per === 'word' && i < segments.length - 1 ? '\u00A0' : ''}
          </motion.span>
        ))}
      </Tag>
    </motion.div>
  )
}

// ── InView wrapper ─────────────────────────────────────────────────

interface InViewProps {
  children: ReactNode
  className?: string
  variants?: Variants
  transition?: object
  viewOptions?: { once?: boolean; margin?: string }
}

const defaultVariants: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
}

export function InView({
  children,
  className,
  variants = defaultVariants,
  transition = { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  viewOptions = { once: true, margin: '-60px' as any },
}: InViewProps) {
  const ref = useRef(null)
  const inView = useInView(ref, viewOptions as any)

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={variants}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ── Animated Group (staggered children) ────────────────────────────

interface AnimatedGroupProps {
  children: ReactNode
  className?: string
  variants?: { container?: Variants; item?: Variants }
  preset?: 'fade' | 'slide-up' | 'scale' | 'blur'
}

const groupPresets = {
  fade: {
    container: { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } },
    item: { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4 } } },
  },
  'slide-up': {
    container: { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } },
    item: {
      hidden: { opacity: 0, y: 32 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
    },
  },
  scale: {
    container: { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } },
    item: {
      hidden: { opacity: 0, scale: 0.9 },
      visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
    },
  },
  blur: {
    container: { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } },
    item: {
      hidden: { opacity: 0, filter: 'blur(8px)' },
      visible: { opacity: 1, filter: 'blur(0px)', transition: { duration: 0.5 } },
    },
  },
}

export function AnimatedGroup({ children, className, variants, preset = 'slide-up' }: AnimatedGroupProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const { container, item } = variants || groupPresets[preset]

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={container}
      className={className}
    >
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div key={i} variants={item}>
              {child}
            </motion.div>
          ))
        : <motion.div variants={item}>{children}</motion.div>
      }
    </motion.div>
  )
}
