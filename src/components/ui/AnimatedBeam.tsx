import { cn } from '@/lib/utils'
import { useEffect, useRef } from 'react'

interface AnimatedBeamProps {
  className?: string
  containerRef: React.RefObject<HTMLElement>
  fromRef: React.RefObject<HTMLElement>
  toRef: React.RefObject<HTMLElement>
  curvature?: number
  reverse?: boolean
  duration?: number
  delay?: number
  pathColor?: string
  pathWidth?: number
  pathOpacity?: number
  gradientStartColor?: string
  gradientStopColor?: string
  startXOffset?: number
  startYOffset?: number
  endXOffset?: number
  endYOffset?: number
}

export function AnimatedBeam({
  className,
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false,
  duration = 3,
  delay = 0,
  pathColor = '#ddd8ce',
  pathWidth = 2,
  pathOpacity = 0.2,
  gradientStartColor = '#2a6049',
  gradientStopColor = '#3a7a5e',
  startXOffset = 0,
  startYOffset = 0,
  endXOffset = 0,
  endYOffset = 0,
}: AnimatedBeamProps) {
  const idRef = useRef(`beam-${Math.random().toString(36).slice(2)}`)
  const pathRef = useRef<SVGPathElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const updatePath = () => {
      if (!containerRef.current || !fromRef.current || !toRef.current || !svgRef.current) return

      const containerRect = containerRef.current.getBoundingClientRect()
      const fromRect = fromRef.current.getBoundingClientRect()
      const toRect = toRef.current.getBoundingClientRect()

      const svgWidth = containerRect.width
      const svgHeight = containerRect.height

      svgRef.current.setAttribute('width', String(svgWidth))
      svgRef.current.setAttribute('height', String(svgHeight))
      svgRef.current.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`)

      const startX = fromRect.left - containerRect.left + fromRect.width / 2 + startXOffset
      const startY = fromRect.top - containerRect.top + fromRect.height / 2 + startYOffset
      const endX = toRect.left - containerRect.left + toRect.width / 2 + endXOffset
      const endY = toRect.top - containerRect.top + toRect.height / 2 + endYOffset

      const controlX = (startX + endX) / 2
      const controlY = (startY + endY) / 2 - curvature

      const d = `M ${startX},${startY} Q ${controlX},${controlY} ${endX},${endY}`
      pathRef.current?.setAttribute('d', d)
    }

    updatePath()
    const observer = new ResizeObserver(updatePath)
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [containerRef, fromRef, toRef, curvature, startXOffset, startYOffset, endXOffset, endYOffset])

  const id = idRef.current
  const gradId = `${id}-grad`

  return (
    <svg
      ref={svgRef}
      className={cn('pointer-events-none absolute inset-0 overflow-visible', className)}
      style={{ position: 'absolute', top: 0, left: 0 }}
    >
      <defs>
        <linearGradient
          id={gradId}
          gradientUnits="userSpaceOnUse"
          x1="0%" y1="0%" x2="100%" y2="0%"
        >
          <stop offset="0%" stopColor={gradientStartColor} stopOpacity="0" />
          <stop offset="30%" stopColor={gradientStartColor} stopOpacity="1" />
          <stop offset="70%" stopColor={gradientStopColor} stopOpacity="1" />
          <stop offset="100%" stopColor={gradientStopColor} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Base path */}
      <path
        ref={pathRef}
        fill="none"
        stroke={pathColor}
        strokeWidth={pathWidth}
        strokeOpacity={pathOpacity}
      />

      {/* Animated beam */}
      <path
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth={pathWidth}
        strokeLinecap="round"
        strokeDasharray="20 9999"
        style={{
          animation: `${reverse ? 'beamReverse' : 'beamForward'} ${duration}s ease-in-out ${delay}s infinite`,
        }}
        ref={el => {
          // copy d from pathRef
          const update = () => {
            const d = pathRef.current?.getAttribute('d')
            if (d && el) el.setAttribute('d', d)
          }
          const ob = new MutationObserver(update)
          if (pathRef.current) ob.observe(pathRef.current, { attributes: true, attributeFilter: ['d'] })
          update()
        }}
      />

      <style>{`
        @keyframes beamForward {
          0% { stroke-dashoffset: 1000; }
          100% { stroke-dashoffset: -1000; }
        }
        @keyframes beamReverse {
          0% { stroke-dashoffset: -1000; }
          100% { stroke-dashoffset: 1000; }
        }
      `}</style>
    </svg>
  )
}
