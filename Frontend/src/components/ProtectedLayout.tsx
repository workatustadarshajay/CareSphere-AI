import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import Header from '../components/Header'
import { getToken } from '../api'

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  if (!getToken()) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      <main className="mx-auto max-w-7xl px-4 pb-12 pt-28 md:pt-24">{children}</main>
    </div>
  )
}
