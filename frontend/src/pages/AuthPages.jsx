import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Leaf, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export function LoginPage() {
  const { login, guestLogin } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ phone: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!form.phone || !form.password) { toast.error('Please fill all fields'); return }
    setLoading(true)
    try {
      await login(form.phone, form.password)
      toast.success('Welcome back!')
      navigate('/')
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Invalid phone or password')
    } finally {
      setLoading(false)
    }
  }

  const guest = async () => {
    setLoading(true)
    try {
      await guestLogin()
      toast.success('Welcome, Kisan Ji!')
      navigate('/')
    } catch {
      toast.error('Could not start guest session')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 52, height: 52, background: 'var(--green-primary)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
            <Leaf size={26} color="white" />
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--gray-900)' }}>PrakritiAI</div>
          <div style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 4 }}>Your Natural Farming Companion</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="form-group">
            <label className="form-label">Mobile Number</label>
            <input
              className="form-input"
              type="tel"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              placeholder="Enter your 10-digit mobile number"
              onKeyDown={e => e.key === 'Enter' && submit()}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                className="form-input"
                type={showPw ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="Enter your password"
                onKeyDown={e => e.key === 'Enter' && submit()}
                style={{ paddingRight: 42 }}
              />
              <button
                onClick={() => setShowPw(s => !s)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)', display: 'flex' }}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button onClick={submit} className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 4 }} disabled={loading}>
            {loading ? <span className="loading-spinner" style={{ width: 18, height: 18 }} /> : 'Sign In'}
          </button>

          <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--gray-400)' }}>or</div>

          <button onClick={guest} className="btn btn-secondary btn-lg" style={{ width: '100%' }} disabled={loading}>
            Continue as Guest
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--gray-500)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--green-primary)', fontWeight: 600, textDecoration: 'none' }}>
            Register
          </Link>
        </div>
      </div>
    </div>
  )
}

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', phone: '', password: '', state: 'Haryana',
    preferred_language: 'hi'
  })
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!form.name || !form.phone || !form.password) { toast.error('Please fill all required fields'); return }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      await register(form)
      toast.success('Account created! Welcome to PrakritiAI.')
      navigate('/')
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const STATES = ['Andhra Pradesh','Bihar','Gujarat','Haryana','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Punjab','Rajasthan','Tamil Nadu','Telangana','Uttar Pradesh','West Bengal']

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ width: 48, height: 48, background: 'var(--green-primary)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <Leaf size={24} color="white" />
          </div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>Create Account</div>
          <div style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 3 }}>Join PrakritiAI - Free for all farmers</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
          {[
            { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Ramesh Kumar' },
            { label: 'Mobile Number', key: 'phone', type: 'tel', placeholder: '9876543210' },
            { label: 'Password (min 6 chars)', key: 'password', type: 'password', placeholder: 'Create a strong password' },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key} className="form-group">
              <label className="form-label">{label} <span style={{ color: 'var(--red)' }}>*</span></label>
              <input
                className="form-input"
                type={type}
                value={form[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder}
              />
            </div>
          ))}

          <div className="grid-2" style={{ gap: 10 }}>
            <div className="form-group">
              <label className="form-label">State</label>
              <select className="form-select" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))}>
                {STATES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Language</label>
              <select className="form-select" value={form.preferred_language} onChange={e => setForm(f => ({ ...f, preferred_language: e.target.value }))}>
                <option value="hi">Hindi</option>
                <option value="en">English</option>
                <option value="hinglish">Hinglish</option>
              </select>
            </div>
          </div>

          <button onClick={submit} className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 6 }} disabled={loading}>
            {loading ? <span className="loading-spinner" style={{ width: 18, height: 18 }} /> : 'Create Account'}
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: 18, fontSize: 13, color: 'var(--gray-500)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--green-primary)', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
        </div>
      </div>
    </div>
  )
}
