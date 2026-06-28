import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import './styles/global.css'

// Auth pages — eager (needed immediately on cold load)
import { LoginPage, RegisterPage } from './pages/AuthPages'

// All app pages — lazy loaded for fast initial bundle
const HomePage = lazy(() => import('./pages/HomePage'))
const AssistantPage = lazy(() => import('./pages/AssistantPage'))
const DiseasePage = lazy(() => import('./pages/DiseasePage'))
const SeedsPage = lazy(() => import('./pages/SeedsPage'))
const WeatherPage = lazy(() => import('./pages/WeatherPage'))
const MarketPage = lazy(() => import('./pages/MarketPage'))
const SchemesPage = lazy(() => import('./pages/SchemesPage'))
const LearnPage = lazy(() => import('./pages/LearnPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const HistoryPage = lazy(() => import('./pages/HistoryAndSettings').then(m => ({ default: m.HistoryPage })))
const SettingsPage = lazy(() => import('./pages/HistoryAndSettings').then(m => ({ default: m.SettingsPage })))
const FarmingCalendar = lazy(() => import('./pages/CalendarAndGlossary').then(m => ({ default: m.FarmingCalendar })))
const Glossary = lazy(() => import('./pages/CalendarAndGlossary').then(m => ({ default: m.Glossary })))

function PageLoader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🌿</div>
        <span className="loading-spinner" style={{ width: 32, height: 32, display: 'block', margin: '0 auto' }} />
        <div style={{ marginTop: 12, fontSize: 13, color: 'var(--gray-400)' }}>Loading...</div>
      </div>
    </div>
  )
}

function NotFoundPage() {
  return (
    <div className="empty-state" style={{ height: '70vh' }}>
      <div className="empty-state-icon">
        <span style={{ fontSize: 36 }}>🌾</span>
      </div>
      <div className="empty-state-title">Yeh page nahi mila</div>
      <div className="empty-state-desc">
        Aap jis page par jaana chahate the woh exist nahi karta.<br />
        Home par wapas jaayein.
      </div>
      <a href="/" className="btn btn-primary" style={{ marginTop: 8, textDecoration: 'none' }}>
        🏠 Home par Jaayein
      </a>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: 'Inter, sans-serif',
              fontSize: 13,
              borderRadius: 8,
              border: '1px solid #E5E7EB',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              maxWidth: 380,
            },
            success: {
              iconTheme: { primary: '#2D6A4F', secondary: 'white' },
              duration: 3000,
            },
            error: {
              iconTheme: { primary: '#EF4444', secondary: 'white' },
              duration: 5000,
            },
          }}
        />
        <Routes>
          {/* Auth pages — no layout */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Main app — with sidebar layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<Suspense fallback={<PageLoader />}><HomePage /></Suspense>} />
            <Route path="/assistant" element={<Suspense fallback={<PageLoader />}><AssistantPage /></Suspense>} />
            <Route path="/disease" element={<Suspense fallback={<PageLoader />}><DiseasePage /></Suspense>} />
            <Route path="/seeds" element={<Suspense fallback={<PageLoader />}><SeedsPage /></Suspense>} />
            <Route path="/weather" element={<Suspense fallback={<PageLoader />}><WeatherPage /></Suspense>} />
            <Route path="/market" element={<Suspense fallback={<PageLoader />}><MarketPage /></Suspense>} />
            <Route path="/schemes" element={<Suspense fallback={<PageLoader />}><SchemesPage /></Suspense>} />
            <Route path="/learn" element={<Suspense fallback={<PageLoader />}><LearnPage /></Suspense>} />
            <Route path="/calendar" element={<Suspense fallback={<PageLoader />}><FarmingCalendar /></Suspense>} />
            <Route path="/glossary" element={<Suspense fallback={<PageLoader />}><Glossary /></Suspense>} />
            <Route path="/history" element={<Suspense fallback={<PageLoader />}><HistoryPage /></Suspense>} />
            <Route path="/settings" element={<Suspense fallback={<PageLoader />}><SettingsPage /></Suspense>} />
            <Route path="/about" element={<Suspense fallback={<PageLoader />}><AboutPage /></Suspense>} />

            {/* 404 catch-all */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
