import { useState, useRef, useEffect } from 'react'
import { Menu, Globe, ChevronDown } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const LANGUAGES = [
  { code: 'hi', label: 'हिंदी' },
  { code: 'en', label: 'English' },
  { code: 'hinglish', label: 'Hinglish' },
  { code: 'mr', label: 'मराठी' },
  { code: 'gu', label: 'ગુજરાતી' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ' },
]

export default function Topbar({ onMenuClick, pageTitle }) {
  const { user, language, changeLanguage } = useAuth()
  const [langOpen, setLangOpen] = useState(false)
  const navigate = useNavigate()
  const langRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[1]

  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          id="sidebar-menu-btn"
          className="mobile-only"
          onClick={onMenuClick}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--gray-500)', display: 'flex', alignItems: 'center',
            padding: 4
          }}
          aria-label="Toggle Sidebar"
        >
          <Menu size={24} />
        </button>
        
        <h1 style={{ fontSize: 18, fontWeight: 600, color: 'var(--gray-900)' }}>
          {pageTitle}
        </h1>
      </div>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
        
        <div ref={langRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setLangOpen(o => !o)}
            className="btn"
            style={{ background: 'var(--gray-50)', border: '1px solid var(--gray-200)', gap: 6, color: 'var(--gray-700)', padding: '6px 12px' }}
          >
            <Globe size={16} />
            <span style={{ fontSize: 14, fontWeight: 500 }}>{currentLang.label}</span>
            <ChevronDown size={14} style={{ transform: langOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
          </button>
          
          {langOpen && (
            <div style={{
              position: 'absolute', right: 0, top: '100%', marginTop: 8,
              background: 'white', border: '1px solid var(--gray-200)',
              borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-md)',
              minWidth: 140, overflow: 'hidden', zIndex: 50, padding: '4px 0'
            }}>
              {LANGUAGES.map(l => (
                <button
                  key={l.code}
                  onClick={() => { changeLanguage(l.code); setLangOpen(false) }}
                  style={{
                    width: '100%', textAlign: 'left', padding: '10px 16px',
                    background: language === l.code ? 'var(--green-bg)' : 'transparent',
                    color: language === l.code ? 'var(--green-primary)' : 'var(--gray-700)',
                    fontWeight: language === l.code ? 600 : 400,
                    border: 'none', cursor: 'pointer', fontSize: 14
                  }}
                  onMouseOver={(e) => {
                    if (language !== l.code) e.currentTarget.style.background = 'var(--gray-50)'
                  }}
                  onMouseOut={(e) => {
                    if (language !== l.code) e.currentTarget.style.background = 'transparent'
                  }}
                >
                  {l.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {user ? (
          <button 
            onClick={() => navigate('/settings')}
            style={{ 
              width: 36, height: 36, borderRadius: '50%', background: 'var(--green-primary)',
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: 14
            }}
          >
            {user.name?.[0]?.toUpperCase() || 'K'}
          </button>
        ) : (
          <button 
            onClick={() => navigate('/login')}
            className="btn btn-primary"
            style={{ padding: '8px 16px', borderRadius: 8, fontWeight: 600, fontSize: 14 }}
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  )
}
