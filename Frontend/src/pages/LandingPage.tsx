import { Link } from 'react-router-dom'
import Scene3D from '../components/Scene3D'

const features = [
  {
    icon: '🩺',
    title: 'AI Symptom Checker',
    description:
      'Describe how you feel and get instant AI-powered insights about possible conditions, severity, and the right specialist to see.',
  },
  {
    icon: '🔍',
    title: 'Find the Right Doctor',
    description:
      'Search a curated network of verified specialists by specialty and location, with experience, ratings, and availability at a glance.',
  },
  {
    icon: '📄',
    title: 'Medical Document Analysis',
    description:
      'Upload lab reports or prescriptions and let AI translate complex medical jargon into plain language with clear next steps.',
  },
]

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0f172a]">
      <Scene3D />

      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(15,23,42,0.85)_75%)]" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-4">
        <header className="flex items-center justify-between py-6">
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 text-lg font-bold text-white shadow-lg shadow-blue-500/30">
              C
            </span>
            <span className="text-xl font-bold text-white">
              CareSphere <span className="text-cyan-400">AI</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-xl border border-white/20 px-5 py-2 text-sm font-medium text-white transition hover:border-cyan-400/60 hover:bg-white/10"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:shadow-cyan-400/40"
            >
              Register
            </Link>
          </div>
        </header>

        <section className="flex flex-1 flex-col items-center justify-center py-16 text-center">
          <span className="mb-6 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 text-xs font-medium tracking-wide text-cyan-300">
            Your Health, Powered by Intelligence
          </span>
          <h1 className="max-w-4xl text-5xl font-extrabold leading-tight tracking-tight text-white md:text-6xl">
            Healthcare that <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">understands you</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
            CareSphere AI combines intelligent symptom analysis, a verified doctor network, and
            instant medical document understanding — one platform for your entire health journey.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Link
              to="/register"
              className="rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 px-8 py-3.5 text-base font-semibold text-white shadow-xl shadow-cyan-500/30 transition hover:-translate-y-0.5 hover:shadow-cyan-400/50"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="rounded-xl border border-white/20 px-8 py-3.5 text-base font-medium text-white transition hover:border-cyan-400/60 hover:bg-white/10"
            >
              I already have an account
            </Link>
          </div>
        </section>

        <section className="grid gap-6 pb-16 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30 backdrop-blur-md transition hover:-translate-y-1 hover:border-cyan-400/40"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-400/20 text-2xl">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-slate-400">{feature.description}</p>
            </div>
          ))}
        </section>

        <footer className="border-t border-white/10 py-6 text-center text-sm text-slate-500">
          CareSphere AI — intelligent healthcare, for everyone.
        </footer>
      </div>
    </div>
  )
}
