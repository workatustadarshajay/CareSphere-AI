import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { appointmentAPI, doctorAPI } from '../api'

interface Doctor {
  _id: string
  name: string
  specialty: string
  experience: number
  rating: number
  available: boolean
  location: string
}

export default function DoctorSearch() {
  const [specialty, setSpecialty] = useState('')
  const [location, setLocation] = useState('')
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState('')
  const [bookedId, setBookedId] = useState('')
  const [bookingMsg, setBookingMsg] = useState('')

  const loadDoctors = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await doctorAPI.search({})
      setDoctors(response.data)
    } catch {
      setError('Could not load doctors. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDoctors()
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setSearching(true)
    setError('')
    setBookingMsg('')
    try {
      const response = await doctorAPI.search({
        specialty: specialty || undefined,
        location: location || undefined,
      })
      setDoctors(response.data)
    } catch {
      setError('Search failed. Please try again.')
    } finally {
      setSearching(false)
    }
  }

  const handleBook = async (doctorId: string) => {
    setBookingMsg('')
    const date = new Date(Date.now() + 86400000).toISOString().slice(0, 10)
    const time = '10:00'
    try {
      await appointmentAPI.book({ doctor_id: doctorId, date, time })
      setBookedId(doctorId)
      setBookingMsg(`Booked for ${date} at ${time}. See Appointments page for details.`)
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        'Booking failed. Please try again.'
      setBookingMsg(message)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Find Doctors</h1>
        <p className="mt-1 text-slate-400">Search verified specialists by specialty and location.</p>
      </div>

      <form
        onSubmit={handleSearch}
        className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md sm:flex-row"
      >
        <input
          type="text"
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          placeholder="Specialty (e.g. Cardiology)"
          className="flex-1 rounded-xl border border-white/10 bg-slate-900/70 px-4 py-2.5 text-white placeholder-slate-500 outline-none transition focus:border-cyan-400/60"
        />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location (e.g. Downtown)"
          className="flex-1 rounded-xl border border-white/10 bg-slate-900/70 px-4 py-2.5 text-white placeholder-slate-500 outline-none transition focus:border-cyan-400/60"
        />
        <button
          type="submit"
          disabled={searching}
          className="rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 px-8 py-2.5 font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:shadow-cyan-400/40 disabled:opacity-60"
        >
          {searching ? 'Searching…' : 'Search'}
        </button>
      </form>

      {bookingMsg && (
        <div className="rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-200">
          {bookingMsg}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-400/30 border-t-cyan-400" />
        </div>
      ) : doctors.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-slate-400 backdrop-blur-md">
          No doctors found matching your search.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doctor) => (
            <div
              key={doctor._id}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition hover:border-cyan-400/40"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-400/30 text-lg font-bold text-cyan-300">
                    {doctor.name.charAt(0)}
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">{doctor.name}</h3>
                    <p className="text-sm text-cyan-300">{doctor.specialty}</p>
                  </div>
                </div>
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                    doctor.available
                      ? 'border-green-500/40 bg-green-500/10 text-green-300'
                      : 'border-slate-500/40 bg-slate-500/10 text-slate-400'
                  }`}
                >
                  {doctor.available ? 'Available' : 'Busy'}
                </span>
              </div>

              <div className="mt-4 flex items-center gap-4 text-sm text-slate-400">
                <span>⭐ {doctor.rating.toFixed(1)}</span>
                <span>{doctor.experience} yrs exp.</span>
                <span>📍 {doctor.location}</span>
              </div>

              {doctor.available && (
                <button
                  onClick={() => handleBook(doctor._id)}
                  disabled={bookedId === doctor._id}
                  className="mt-4 w-full rounded-xl border border-cyan-400/40 bg-cyan-400/10 py-2 text-sm font-medium text-cyan-300 transition hover:bg-cyan-400/20 disabled:opacity-50"
                >
                  {bookedId === doctor._id ? '✓ Booked' : 'Book Appointment'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="text-center">
        <Link to="/appointments" className="text-sm text-cyan-400 hover:text-cyan-300">
          View your appointments →
        </Link>
      </div>
    </div>
  )
}
