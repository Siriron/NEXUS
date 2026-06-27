import { cn } from '@/lib/utils'
import { type ReactNode } from 'react'

interface ShimmerButtonProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit'
  shimmerColor?: string
  shimmerSize?: string
  borderRadius?: string
  background?: string
}

export function ShimmerButton({
  children,
  className,
  onClick,
  disabled,
  type = 'button',
  shimmerColor = 'rgba(255,255,255,0.25)',
  borderRadius = '10px',
  background = 'rgba(42, 96, 73, 1)',
}: ShimmerButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{ borderRadius, background }}
      className={cn(
        'group relative z-0 flex cursor-pointer items-center justify-center gap-2',
        'overflow-hidden whitespace-nowrap px-6 py-3',
        'text-white font-semibold text-sm',
        'transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
    >
      {/* Shimmer layer */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ borderRadius }}
      >
        <div
          className="absolute inset-0 -translate-x-full animate-[shimmer_2.5s_linear_infinite] group-hover:animate-[shimmer_1.8s_linear_infinite]"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${shimmerColor} 50%, transparent 100%)`,
            backgroundSize: '200% 100%',
            animation: 'shimmerMove 2.5s linear infinite',
          }}
        />
      </div>

      {/* Spark lines */}
      <div
        className="absolute inset-px z-10 rounded-[9px]"
        style={{ background }}
      />

      {/* Content */}
      <span className="relative z-20 flex items-center gap-2">{children}</span>

      <style>{`
        @keyframes shimmerMove {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </button>
  )
}
