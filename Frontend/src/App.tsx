import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProtectedLayout from './components/ProtectedLayout'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import SymptomChecker from './pages/SymptomChecker'
import DoctorSearch from './pages/DoctorSearch'
import Appointments from './pages/Appointments'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedLayout>
              <Dashboard />
            </ProtectedLayout>
          }
        />
        <Route
          path="/symptoms"
          element={
            <ProtectedLayout>
              <SymptomChecker />
            </ProtectedLayout>
          }
        />
        <Route
          path="/doctors"
          element={
            <ProtectedLayout>
              <DoctorSearch />
            </ProtectedLayout>
          }
        />
        <Route
          path="/appointments"
          element={
            <ProtectedLayout>
              <Appointments />
            </ProtectedLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
