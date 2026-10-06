import { Link } from 'react-router-dom'
import { clearToken, getToken } from '../api'

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/symptoms', label: 'Symptoms' },
  { to: '/doctors', label: 'Doctors' },
  { to: '/appointments', label: 'Appointments' },
]

export default function Header() {
  const isLoggedIn = Boolean(getToken())

  const handleLogout = () => {
    clearToken()
    window.location.href = '/login'
  }

  if (!isLoggedIn) return null

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-slate-900/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/dashboard" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 text-sm font-bold text-white">
            C
          </span>
          <span className="text-lg font-bold text-white">
            CareSphere <span className="text-cyan-400">AI</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="rounded-lg border border-white/20 px-4 py-1.5 text-sm text-slate-200 transition hover:border-red-400/50 hover:bg-red-500/10 hover:text-red-300"
        >
          Logout
        </button>
      </div>

      <nav className="flex items-center justify-center gap-1 border-t border-white/10 px-2 py-2 md:hidden">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="rounded-lg px-2.5 py-1.5 text-xs text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
