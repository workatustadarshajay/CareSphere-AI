import { useState } from 'react'
import { symptomAPI } from '../api'

interface Condition {
  name: string
  probability: number
}

interface AnalysisResult {
  severity: string
  possible_conditions: Condition[]
  specialists: string[]
  emergency_signs: string
  recommendation?: string
}

const COMMON_SYMPTOMS = [
  'fever',
  'cough',
  'headache',
  'fatigue',
  'sore throat',
  'back pain',
  'chest pain',
]

const severityStyles: Record<string, string> = {
  mild: 'border-green-500/40 bg-green-500/10 text-green-300',
  moderate: 'border-yellow-500/40 bg-yellow-500/10 text-yellow-300',
  severe: 'border-red-500/40 bg-red-500/10 text-red-300',
}

const severityLabels: Record<string, string> = {
  mild: '🟢 Mild',
  moderate: '🟡 Moderate',
  severe: '🔴 Severe',
}

export default function SymptomChecker() {
  const [selected, setSelected] = useState<string[]>([])
  const [custom, setCustom] = useState('')
  const [age, setAge] = useState('')
  const [history, setHistory] = useState('')
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const toggleSymptom = (symptom: string) => {
    setSelected((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    )
  }

  const addCustom = () => {
    const value = custom.trim().toLowerCase()
    if (value && !selected.includes(value)) {
      setSelected((prev) => [...prev, value])
    }
    setCustom('')
  }

  const analyze = async () => {
    if (selected.length === 0) {
      setError('Please select at least one symptom.')
      return
    }
    const ageNum = Number(age)
    if (!age || Number.isNaN(ageNum) || ageNum < 0 || ageNum > 120) {
      setError('Please enter a valid age between 0 and 120.')
      return
    }
    setError('')
    setLoading(true)
    setResult(null)
    try {
      const response = await symptomAPI.analyze({
        symptoms: selected,
        age: ageNum,
        medical_history: history,
      })
      setResult(response.data)
    } catch {
      setError('Analysis failed. Please try again in a moment.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">AI Symptom Checker</h1>
        <p className="mt-1 text-slate-400">
          Select your symptoms and get an instant AI-powered health assessment.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
          Common Symptoms
        </h3>
        <div className="flex flex-wrap gap-2">
          {COMMON_SYMPTOMS.map((symptom) => {
            const active = selected.includes(symptom)
            return (
              <button
                key={symptom}
                onClick={() => toggleSymptom(symptom)}
                className={`rounded-full border px-4 py-1.5 text-sm capitalize transition ${
                  active
                    ? 'border-cyan-400/60 bg-cyan-400/15 text-cyan-300'
                    : 'border-white/15 bg-white/5 text-slate-300 hover:border-white/30 hover:text-white'
                }`}
              >
                {symptom}
              </button>
            )
          })}
        </div>

        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCustom()}
            placeholder="Add a custom symptom…"
            className="flex-1 rounded-xl border border-white/10 bg-slate-900/70 px-4 py-2.5 text-white placeholder-slate-500 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
          />
          <button
            onClick={addCustom}
            className="rounded-xl border border-white/20 px-5 text-sm font-medium text-white transition hover:border-cyan-400/60 hover:bg-white/10"
          >
            Add
          </button>
        </div>

        {selected.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase tracking-wide text-slate-500">Selected:</span>
            {selected.map((symptom) => (
              <button
                key={symptom}
                onClick={() => toggleSymptom(symptom)}
                className="group flex items-center gap-1.5 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-300 transition hover:border-red-400/50 hover:bg-red-500/10 hover:text-red-300"
              >
                {symptom}
                <span className="text-[10px] opacity-60 group-hover:opacity-100">✕</span>
              </button>
            ))}
          </div>
        )}

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="age" className="mb-1.5 block text-sm font-medium text-slate-300">
              Age
            </label>
            <input
              id="age"
              type="number"
              min={0}
              max={120}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="30"
              className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-2.5 text-white placeholder-slate-500 outline-none transition focus:border-cyan-400/60"
            />
          </div>
          <div>
            <label htmlFor="history" className="mb-1.5 block text-sm font-medium text-slate-300">
              Medical History
            </label>
            <input
              id="history"
              type="text"
              value={history}
              onChange={(e) => setHistory(e.target.value)}
              placeholder="e.g. asthma, diabetes…"
              className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-2.5 text-white placeholder-slate-500 outline-none transition focus:border-cyan-400/60"
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <button
          onClick={analyze}
          disabled={loading}
          className="mt-5 w-full rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 py-3 font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:shadow-cyan-400/40 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Analyzing…' : 'Analyze Symptoms'}
        </button>
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-400/30 border-t-cyan-400" />
        </div>
      )}

      {result && !loading && (
        <div className="space-y-6">
          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <h3 className="text-lg font-semibold text-white">Analysis Result</h3>
            <span
              className={`rounded-full border px-4 py-1.5 text-sm font-semibold capitalize ${
                severityStyles[result.severity] || severityStyles.moderate
              }`}
            >
              {severityLabels[result.severity] || result.severity}
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <h4 className="mb-4 font-semibold text-white">Possible Conditions</h4>
              <div className="space-y-3">
                {result.possible_conditions?.map((condition) => (
                  <div key={condition.name}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="capitalize text-slate-200">{condition.name}</span>
                      <span className="text-cyan-300">
                        {Math.round(condition.probability * 100)}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                        style={{ width: `${Math.round(condition.probability * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                <h4 className="mb-3 font-semibold text-white">Recommended Specialists</h4>
                <div className="flex flex-wrap gap-2">
                  {result.specialists?.map((specialist) => (
                    <span
                      key={specialist}
                      className="rounded-full border border-blue-400/40 bg-blue-400/10 px-3 py-1 text-sm capitalize text-blue-300"
                    >
                      {specialist}
                    </span>
                  ))}
                </div>
              </div>

              {result.recommendation && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                  <h4 className="mb-2 font-semibold text-white">Recommendation</h4>
                  <p className="text-sm leading-relaxed text-slate-300">{result.recommendation}</p>
                </div>
              )}

              <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6">
                <h4 className="mb-2 flex items-center gap-2 font-semibold text-red-300">
                  ⚠️ Emergency Warning Signs
                </h4>
                <p className="text-sm leading-relaxed text-red-200/90">{result.emergency_signs}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
