import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [language, setLanguage] = useState(localStorage.getItem('prakriti_lang') || 'hi')

  useEffect(() => {
    authAPI.me().then(r => {
      setUser(r.data)
    }).catch(() => {
      setUser(null)
    }).finally(() => {
      setLoading(false)
    })
  }, [])

  const login = async (phone, password) => {
    const r = await authAPI.login({ phone, password })
    setUser(r.data.user)
    return r.data
  }

  const register = async (data) => {
    const r = await authAPI.register(data)
    setUser(r.data.user)
    return r.data
  }

  const guestLogin = async () => {
    const r = await authAPI.guest({ name: 'Kisan Ji', state: 'Haryana', preferred_language: 'hi' })
    setUser({ ...r.data.user, isGuest: true })
    return r.data
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch(e) {
      // ignore
    }
    setUser(null)
  }

  const changeLanguage = (lang) => {
    setLanguage(lang)
    localStorage.setItem('prakriti_lang', lang)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, guestLogin, logout, language, changeLanguage }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
