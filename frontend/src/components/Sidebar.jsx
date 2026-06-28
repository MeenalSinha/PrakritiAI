import { NavLink, Link } from 'react-router-dom'
import {
  Leaf, Mic, Camera, Sprout, Cloud, TrendingUp,
  BookOpen, MessageCircle, Settings, Home, LogOut,
  Building2, X, Info, Calendar, BookMarked
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: Home, end: true },
  { path: '/assistant', label: 'AI Assistant', icon: Mic },
  { path: '/disease', label: 'Crop Doctor', icon: Camera },
  { path: '/seeds', label: 'Seed Advisor', icon: Sprout },
  { path: '/weather', label: 'Weather', icon: Cloud },
  { path: '/market', label: 'Market Prices', icon: TrendingUp },
  { path: '/schemes', label: 'Govt Schemes', icon: Building2 },
  { path: '/learn', label: 'Learn Farming', icon: BookOpen },
  { path: '/calendar', label: 'Farm Calendar', icon: Calendar },
  { path: '/glossary', label: 'Glossary', icon: BookMarked },
  { path: '/history', label: 'Chat History', icon: MessageCircle },
  { path: '/settings', label: 'Settings', icon: Settings },
  { path: '/about', label: 'About', icon: Info },
]

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth()

  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      {/* Mobile Close Button */}
      {open && (
        <button
          className="sidebar-close-btn mobile-only"
          onClick={onClose}
          style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: 'var(--gray-500)', zIndex: 10 }}
        >
          <X size={24} />
        </button>
      )}

      <div className="sidebar-logo">
        <div className="logo-icon">
          <Leaf size={24} />
        </div>
        <div className="logo-text">
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--green-primary)' }}>PrakritiAI</div>
          <div style={{ fontSize: 11, color: 'var(--gray-500)' }}>Natural Farming Companion</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map(({ path, label, icon: Icon, end }) => (
          <NavLink
            key={path}
            to={path}
            end={end}
            onClick={onClose}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Icon /> {label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        {user ? (
          <button
            onClick={() => { logout(); onClose() }}
            className="btn"
            style={{ width: '100%', color: 'var(--red)', background: 'var(--red-light)' }}
          >
            <LogOut size={16} /> Sign Out
          </button>
        ) : (
          <Link
            to="/login"
            onClick={onClose}
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Sign In
          </Link>
        )}
      </div>
    </aside>
  )
}
