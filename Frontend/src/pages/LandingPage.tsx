import { Link } from 'react-router-dom'
import {
  Heartbeat,
  Stethoscope,
  FileText,
  ShieldCheck,
  CalendarCheck,
  Sparkle,
  ArrowRight,
} from '@phosphor-icons/react'
import Scene3D from '../components/Scene3D'

const trustPoints = [
  { icon: ShieldCheck, label: 'Private by design' },
  { icon: Sparkle, label: 'AI-assisted triage' },
  { icon: CalendarCheck, label: 'Book in seconds' },
]

const features = [
  {
    icon: Heartbeat,
    title: 'Symptom analysis that explains itself',
    body: 'Describe what you feel in plain words. Get likely conditions, a severity read, and clear emergency signs to watch for.',
  },
  {
    icon: Stethoscope,
    title: 'The right specialist, not just any doctor',
    body: 'Search a verified network by specialty and location. Experience, ratings, and live availability on every profile.',
  },
  {
    icon: FileText,
    title: 'Lab reports translated to human',
    body: 'Upload a report and get plain-language explanations with concrete next steps you can discuss with your doctor.',
  },
]

const steps = [
  {
    title: 'Describe',
    body: 'Tap your symptoms or type them in. No medical vocabulary needed.',
  },
  {
    title: 'Understand',
    body: 'AI maps your inputs to likely conditions, severity, and warning signs.',
  },
  {
    title: 'Act',
    body: 'Book the recommended specialist in a couple of clicks. Records stay yours.',
  },
]

export default function LandingPage() {
  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-[#05080f] text-slate-100">
      <Scene3D />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_top,transparent_0%,rgba(5,8,15,0.4)_55%,rgba(5,8,15,0.92)_100%)]" />

      <div className="relative z-10">
        {/* Nav */}
        <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/20">
              <Heartbeat size={20} weight="bold" />
            </span>
            <span className="text-lg font-semibold tracking-tight">
              CareSphere <span className="text-emerald-400">AI</span>
            </span>
          </Link>
          <div className="flex items-center gap-2.5">
            <Link
              to="/login"
              className="rounded-full px-5 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/5 hover:text-white"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="rounded-full bg-emerald-400 px-5 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/25 transition hover:-translate-y-px hover:bg-emerald-300 active:translate-y-0 active:scale-[0.98]"
            >
              Create account
            </Link>
          </div>
        </header>

        {/* Hero: asymmetric, 3D scene breathes on the right */}
        <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-6 pb-20 pt-16 md:pt-24 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h1 className="max-w-xl text-4xl font-semibold leading-[1.08] tracking-tight md:text-6xl">
              Care that starts with
              <span className="block bg-gradient-to-r from-emerald-300 to-teal-400 bg-clip-text text-transparent">
                understanding you
              </span>
            </h1>
            <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-slate-400">
              Check symptoms, find the right specialist, and actually understand your
              medical reports. One calm place for your health.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                to="/register"
                className="group inline-flex items-center gap-2 rounded-full bg-emerald-400 px-7 py-3.5 font-semibold text-slate-950 shadow-xl shadow-emerald-500/25 transition hover:-translate-y-px hover:bg-emerald-300 active:translate-y-0 active:scale-[0.98]"
              >
                Get started free
                <ArrowRight
                  size={18}
                  weight="bold"
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
              <Link
                to="/login"
                className="rounded-full border border-white/15 px-7 py-3.5 font-medium text-slate-100 transition hover:border-emerald-400/40 hover:bg-white/5"
              >
                I have an account
              </Link>
            </div>
          </div>
          {/* Right column intentionally open: the 3D cross, helix and ECG live here */}
          <div className="hidden lg:col-span-6 lg:block" aria-hidden="true" />
        </section>

        {/* Trust band under the hero */}
        <section className="border-y border-white/5 bg-white/[0.02] backdrop-blur-sm">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-12 gap-y-4 px-6 py-6">
            {trustPoints.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2.5 text-sm text-slate-300">
                <Icon size={18} className="text-emerald-400" weight="duotone" />
                {label}
              </div>
            ))}
          </div>
        </section>

        {/* Features: editorial split rows, each with its own visual block */}
        <section className="mx-auto max-w-7xl px-6 py-24">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Three ways it takes care of you
            </h2>
            <p className="mt-4 max-w-[52ch] leading-relaxed text-slate-400">
              Every feature answers one question: what should you do next about your
              health, with the least friction possible.
            </p>
          </div>

          <div className="mt-16 space-y-6">
            {features.map(({ icon: Icon, title, body }, index) => (
              <article
                key={title}
                className="group grid grid-cols-1 items-center gap-6 rounded-3xl border border-white/[0.06] bg-white/[0.03] p-8 backdrop-blur-md transition hover:border-emerald-400/25 md:grid-cols-12 md:p-10"
              >
                <div className={`md:col-span-7 ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10">
                    <Icon size={24} className="text-emerald-300" weight="duotone" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold tracking-tight md:text-2xl">{title}</h3>
                  <p className="mt-3 max-w-[52ch] leading-relaxed text-slate-400">{body}</p>
                  <Link
                    to="/register"
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-300 transition hover:text-emerald-200"
                  >
                    Try it now
                    <ArrowRight size={14} weight="bold" className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
                <div
                  className={`hidden h-44 md:col-span-5 md:block ${index % 2 === 1 ? 'md:order-1' : ''}`}
                >
                  <div className="h-full w-full rounded-2xl border border-white/[0.06] bg-gradient-to-br from-emerald-400/[0.08] via-transparent to-sky-400/[0.06]" />
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* How it works: horizontal steps */}
        <section className="mx-auto max-w-7xl px-6 pb-24">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {steps.map(({ title, body }, index) => (
              <div
                key={title}
                className="rounded-3xl border border-white/[0.06] bg-white/[0.03] p-8 backdrop-blur-md"
              >
                <span className="text-sm font-semibold text-emerald-400">0{index + 1}</span>
                <h3 className="mt-3 text-xl font-semibold tracking-tight">{title}</h3>
                <p className="mt-2.5 leading-relaxed text-slate-400">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA band */}
        <section className="mx-auto max-w-7xl px-6 pb-24">
          <div className="relative overflow-hidden rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-400/10 via-white/[0.03] to-teal-400/10 p-12 text-center backdrop-blur-md md:p-16">
            <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">
              Your health, finally in one place
            </h2>
            <p className="mx-auto mt-4 max-w-[48ch] text-slate-400">
              Free to start. No card, no waiting room. Just answers.
            </p>
            <Link
              to="/register"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-emerald-400 px-8 py-3.5 font-semibold text-slate-950 shadow-xl shadow-emerald-500/25 transition hover:-translate-y-px hover:bg-emerald-300 active:translate-y-0 active:scale-[0.98]"
            >
              Create your account
              <ArrowRight size={18} weight="bold" />
            </Link>
          </div>
        </section>

        <footer className="border-t border-white/5">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-slate-500 md:flex-row">
            <span>CareSphere AI</span>
            <span>For guidance only. Not a substitute for professional medical advice.</span>
          </div>
        </footer>
      </div>
    </div>
  )
}
