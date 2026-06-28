import { useState, useEffect } from 'react'
import { Outlet, useLocation, NavLink } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { Home, Mic, Camera, Cloud, TrendingUp, BookOpen } from 'lucide-react'

const PAGE_TITLES = {
  '/': 'Home',
  '/assistant': 'AI Assistant',
  '/disease': 'Crop Doctor',
  '/seeds': 'Seed Advisor',
  '/weather': 'Weather',
  '/market': 'Market Prices',
  '/schemes': 'Government Schemes',
  '/learn': 'Learn Natural Farming',
  '/calendar': 'Organic Farming Calendar',
  '/glossary': 'Farming Glossary',
  '/history': 'Chat History',
  '/settings': 'Settings',
  '/about': 'About PrakritiAI',
}

const BOTTOM_NAV = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/assistant', label: 'Assistant', icon: Mic },
  { path: '/disease', label: 'Crop Doctor', icon: Camera },
  { path: '/weather', label: 'Weather', icon: Cloud },
  { path: '/market', label: 'Market', icon: TrendingUp },
]

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const title = PAGE_TITLES[location.pathname] || 'PrakritiAI'

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  // Prevent body scroll when sidebar open on mobile
  useEffect(() => {
    if (sidebarOpen && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [sidebarOpen])

  return (
    <>
      {/* Skip to content link for keyboard users */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <div className="app-layout">
        {/* Sidebar overlay (mobile) */}
        <div
          className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />

        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="main-content">
          <Topbar
            onMenuClick={() => setSidebarOpen(o => !o)}
            pageTitle={title}
          />
          <main id="main-content" className="page-content page-enter">
            <Outlet />
          </main>
        </div>

        {/* Mobile Bottom Navigation */}
        <nav
          className="mobile-bottom-nav"
          aria-label="Mobile bottom navigation"
        >
          <div className="mobile-bottom-nav-items">
            {BOTTOM_NAV.map(({ path, label, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                end={path === '/'}
                className={({ isActive }) =>
                  `mobile-nav-item ${isActive ? 'active' : ''}`
                }
                aria-label={label}
              >
                <Icon size={20} />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </>
  )
}
