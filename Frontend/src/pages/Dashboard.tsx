import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { userAPI } from '../api'

interface Profile {
  name: string
  email: string
  age?: number
  medical_history?: string
}

const cards = [
  {
    to: '/symptoms',
    icon: '🩺',
    title: 'Symptom Checker',
    description: 'AI-powered analysis of your symptoms with severity and specialist guidance.',
  },
  {
    to: '/doctors',
    icon: '🔍',
    title: 'Find Doctors',
    description: 'Search verified specialists by specialty and location, with live availability.',
  },
  {
    to: '/appointments',
    icon: '📅',
    title: 'Appointments',
    description: 'View and manage your upcoming consultations in one place.',
  },
]

export default function Dashboard() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    userAPI
      .getProfile()
      .then((res) => setProfile(res.data))
      .catch(() => setError('Could not load your profile. Please try again later.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-400/30 border-t-cyan-400" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-4 text-red-300">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-blue-500/10 via-white/5 to-cyan-400/10 p-8 backdrop-blur-md">
        <h1 className="text-3xl font-bold text-white">
          Welcome back, {profile?.name?.split(' ')[0] || 'there'} 👋
        </h1>
        <p className="mt-2 text-slate-300">
          Here&apos;s your health overview. What would you like to do today?
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-xl hover:shadow-cyan-500/10"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-400/20 text-2xl">
              {card.icon}
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">{card.title}</h3>
            <p className="text-sm leading-relaxed text-slate-400">{card.description}</p>
            <span className="mt-4 inline-block text-sm font-medium text-cyan-400 transition group-hover:translate-x-1">
              Open →
            </span>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
          📋 Medical Records
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-slate-900/50 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Age</p>
            <p className="mt-1 text-xl font-semibold text-white">{profile?.age ?? '—'}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-900/50 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Medical History</p>
            <p className="mt-1 text-sm leading-relaxed text-slate-300">
              {profile?.medical_history || 'No medical history recorded.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
