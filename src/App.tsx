import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ErrorBoundary } from '@/pages/NotFound'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Landing from '@/pages/Landing'
import SubmitAudit from '@/pages/SubmitAudit'
import Registry from '@/pages/Registry'
import MyAudits from '@/pages/MyAudits'
import Docs from '@/pages/Docs'
import { NotFound } from '@/pages/NotFound'

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="min-h-screen bg-[#f0ebe3] dark:bg-[#1a1714] text-[#1c1a17] dark:text-[#f0ebe3]">
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/submit" element={<SubmitAudit />} />
            <Route path="/registry" element={<Registry />} />
            <Route path="/my-audits" element={<MyAudits />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
