import axios from 'axios'

const TOKEN_KEY = 'caresphere_token'

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token)
export const clearToken = () => localStorage.removeItem(TOKEN_KEY)

// Dev: Vite proxies /api -> backend, so the browser never needs direct access
// to the backend port (no CORS / port-forwarding issues).
// Prod: set VITE_API_BASE_URL to the backend URL and it is used directly.
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api'

const api = axios.create({ baseURL })

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authAPI = {
  register: (data: { email: string; password: string; name: string; age: number; medical_history: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
}

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
}

export const symptomAPI = {
  analyze: (data: { symptoms: string[]; age: number; medical_history: string }) =>
    api.post('/symptoms/analyze', data),
}

export const documentAPI = {
  analyze: (file: File, docType: string) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('doc_type', docType)
    return api.post('/documents/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

export const doctorAPI = {
  search: (params: { specialty?: string; location?: string }) =>
    api.get('/doctors/search', { params }),
}

export const appointmentAPI = {
  book: (data: { doctor_id: string; date: string; time: string }) =>
    api.post('/appointments/book', data),
  list: () => api.get('/appointments/list'),
}

export default api
