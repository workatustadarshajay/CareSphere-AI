import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { appointmentAPI } from '../api'

interface Appointment {
  _id: string
  doctor_id: string
  doctor_name?: string
  date: string
  time: string
  status: string
}

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    appointmentAPI
      .list()
      .then((res) => setAppointments(res.data))
      .catch(() => setError('Could not load appointments. Please try again later.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-400/30 border-t-cyan-400" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">My Appointments</h1>
        <p className="mt-1 text-slate-400">All your upcoming consultations in one place.</p>
      </div>

      {appointments.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center backdrop-blur-md">
          <p className="text-4xl">📅</p>
          <p className="mt-4 text-lg font-medium text-white">No appointments yet</p>
          <p className="mt-1 text-sm text-slate-400">
            Book your first consultation from the doctors page.
          </p>
          <Link
            to="/doctors"
            className="mt-6 inline-block rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:shadow-cyan-400/40"
          >
            Find Doctors
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment._id}
              className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-400/20 text-2xl">
                  🩺
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    {appointment.doctor_name || 'Doctor'}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {appointment.date} at {appointment.time}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full border border-cyan-400/40 bg-cyan-400/10 px-3 py-1 text-xs font-medium capitalize text-cyan-300">
                  {appointment.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
