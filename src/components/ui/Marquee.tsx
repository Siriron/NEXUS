import { cn } from '@/lib/utils'
import { type ReactNode } from 'react'

interface MarqueeProps {
  className?: string
  reverse?: boolean
  pauseOnHover?: boolean
  children?: ReactNode
  vertical?: boolean
  repeat?: number
  speed?: number
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  speed = 40,
}: MarqueeProps) {
  return (
    <div
      className={cn(
        'group flex overflow-hidden p-2',
        vertical ? 'flex-col' : 'flex-row',
        className
      )}
      style={
        {
          '--duration': `${speed}s`,
          '--gap': '1rem',
        } as React.CSSProperties
      }
    >
      {Array(repeat).fill(0).map((_, i) => (
        <div
          key={i}
          className={cn(
            'flex shrink-0 gap-4',
            vertical ? 'flex-col' : 'flex-row',
            vertical
              ? reverse
                ? '[animation:marquee-vertical_var(--duration)_linear_infinite_reverse]'
                : '[animation:marquee-vertical_var(--duration)_linear_infinite]'
              : reverse
              ? '[animation:marquee_var(--duration)_linear_infinite_reverse]'
              : '[animation:marquee_var(--duration)_linear_infinite]',
            pauseOnHover && 'group-hover:[animation-play-state:paused]'
          )}
        >
          {children}
        </div>
      ))}

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(calc(-100% - var(--gap))); }
        }
        @keyframes marquee-vertical {
          from { transform: translateY(0); }
          to { transform: translateY(calc(-100% - var(--gap))); }
        }
      `}</style>
    </div>
  )
}
