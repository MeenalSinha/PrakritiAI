import axios from 'axios'
import toast from 'react-hot-toast'

const BASE_URL = '/api/v1'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 20000, // 20 second timeout
  withCredentials: true, // Crucial for HttpOnly cookies
})

// Global response error handling
api.interceptors.response.use(
  response => response,
  error => {
    const status = error.response?.status
    const url = error.config?.url || ''

    if (status === 401) {
      // Only redirect if not already on auth pages and not a /auth/ route
      if (!url.includes('/auth/') && !window.location.pathname.includes('/login')) {
        localStorage.removeItem('prakriti_user')
        // We let the frontend auth context or components handle the redirect
      }
    } else if (status === 429) {
      // Rate limit — show friendly toast
      toast.error('Bahut zyada requests! Thodi der baad dobara try karein.', { id: 'rate-limit' })
    } else if (status >= 500) {
      toast.error('Server mein kuch takleef hai. Baad mein try karein.', { id: 'server-error' })
    }
    return Promise.reject(error)
  }
)

// ─── Auth ─────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  guest: (data) => api.post('/auth/guest', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.post('/auth/change-password', data),
}

// ─── Chat ─────────────────────────────────────────────
export const chatAPI = {
  sendMessage: (data) => api.post('/chat/message', data),
  getHistory: (sessionId) => api.get(`/chat/history/${sessionId}`),
  getConversations: () => api.get('/chat/conversations'),
  toggleFavorite: (sessionId) => api.post(`/chat/conversations/${sessionId}/favorite`),
  deleteConversation: (sessionId) => api.delete(`/chat/conversations/${sessionId}`),
}

// ─── Disease ───────────────────────────────────────────
export const diseaseAPI = {
  diagnose: (formData) => api.post('/disease/diagnose', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 45000, // longer timeout for image upload + AI
  }),
  getHistory: () => api.get('/disease/history'),
  getByDisease: (name) => api.get(`/disease/info/${encodeURIComponent(name)}`),
}

// ─── Seeds ─────────────────────────────────────────────
export const seedAPI = {
  recommend: (data) => api.post('/seeds/recommend', data),
  getVarieties: (crop) => api.get(`/seeds/varieties/${encodeURIComponent(crop)}`),
}

// ─── Weather ───────────────────────────────────────────
export const weatherAPI = {
  current: (city, lat, lon) => {
    const params = {}
    if (city) params.city = city
    if (lat !== undefined && lat !== null) params.lat = lat
    if (lon !== undefined && lon !== null) params.lon = lon
    return api.get('/weather/current', { params })
  },
}

// ─── Market ────────────────────────────────────────────
export const marketAPI = {
  prices: (state, district, crop) => {
    const params = {}
    if (state) params.state = state
    if (district) params.district = district
    if (crop) params.crop = crop
    return api.get('/market/prices', { params })
  },
  cropDetail: (crop) => api.get(`/market/prices/${encodeURIComponent(crop)}`),
  trends: (crop) => api.get(`/market/trends/${encodeURIComponent(crop)}`),
}

// ─── Schemes ───────────────────────────────────────────
export const schemesAPI = {
  list: (params) => api.get('/schemes/', { params }),
  getById: (id) => api.get(`/schemes/${id}`),
  search: (query) => api.get('/schemes/', { params: { search: query } }),
}

// ─── Learning ──────────────────────────────────────────
export const learningAPI = {
  lessons: (params) => api.get('/learning/lessons', { params }),
  getLesson: (id) => api.get(`/learning/lessons/${id}`),
  complete: (id) => api.post(`/learning/lessons/${id}/complete`),
}

// ─── Tips & Dashboard ──────────────────────────────────
export const tipsAPI = {
  daily: () => api.get('/tips/daily'),
}

export const dashboardAPI = {
  get: () => api.get('/dashboard/'),
  update: (data) => api.put('/dashboard/', data),
}

// ─── KVK ───────────────────────────────────────────────
export const kvkAPI = {
  nearby: (state, district) => api.get('/kvk/nearby', {
    params: { state, district }
  }),
}

// ─── Health ────────────────────────────────────────────
export const healthAPI = {
  check: () => api.get('/../../api/health').catch(() =>
    fetch('/api/health').then(r => r.json())
  ),
}

export default api
