import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Component, type ReactNode } from 'react'

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p className="font-mono text-6xl font-bold text-accent mb-4">404</p>
        <h1 className="font-display text-3xl font-bold text-[#1c1a17] dark:text-[#f0ebe3] mb-3">Page Not Found</h1>
        <p className="text-[#1c1a17]/60 dark:text-[#f0ebe3]/60 mb-8">This route doesn't exist in the protocol.</p>
        <Link to="/" className="shimmer-btn px-6 py-3 text-sm font-semibold rounded-lg inline-block">
          Back to Home
        </Link>
      </motion.div>
    </div>
  )
}

interface ErrorBoundaryState { hasError: boolean; message: string }

export class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, message: error.message }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <p className="font-mono text-4xl font-bold text-red-500 mb-4">Error</p>
            <h1 className="font-display text-2xl font-bold text-[#1c1a17] dark:text-[#f0ebe3] mb-3">Something went wrong</h1>
            <p className="text-sm text-[#1c1a17]/60 dark:text-[#f0ebe3]/60 font-mono mb-8">{this.state.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="shimmer-btn px-6 py-3 text-sm font-semibold rounded-lg"
            >
              Reload
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
