import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mic, Upload, Cloud, ArrowRight, Phone, Leaf, Sun, Droplets, Wind, Info, ChevronRight, CheckCircle2, TrendingUp, MapPin, Building2, BookOpen, Clock, Camera } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from '../utils/useTranslation'
import { weatherAPI, marketAPI, tipsAPI, dashboardAPI, kvkAPI, diseaseAPI, learningAPI } from '../utils/api'

// Fallback data
const MOCK_WEATHER = { temperature: 32, description: 'Partly Cloudy', humidity: 48, wind_speed: 12, rain_chance: 10, icon: '02d', forecast: [
  { day: 'Mon', icon: '01d', high: 33, low: 24 },
  { day: 'Tue', icon: '01d', high: 32, low: 23 },
  { day: 'Wed', icon: '02d', high: 31, low: 22 },
  { day: 'Thu', icon: '02d', high: 30, low: 22 },
  { day: 'Fri', icon: '09d', high: 31, low: 23 },
] }
const MOCK_DIAGNOSES = [
  { image_url: '/images/tomato_blight.png', disease_name: 'Tomato - Early Blight', confidence: 91 },
  { image_url: '/images/chilli_aphids.png', disease_name: 'Chilli - Aphids', confidence: 87 },
  { image_url: '/images/brinjal_spot.png', disease_name: 'Brinjal - Leaf Spot', confidence: 89 },
]
const MOCK_LESSONS = [
  { title: 'Jeevamrut', description: 'Learn how to prepare and use jeevamrut', read_time: '5 min read', cover_image: '/images/jeevamrut.png' },
  { title: 'Beejamrut', description: 'Seed treatment for better germination', read_time: '4 min read', cover_image: '/images/beejamrut.png' },
  { title: 'Multilevel Farming', description: 'Increase productivity naturally', read_time: '6 min read', cover_image: '/images/multilevel_farming.png' },
  { title: 'Crop Rotation', description: 'Improve soil fertility naturally', read_time: '5 min read', cover_image: '/images/crop_rotation.png' },
]
const MOCK_DASHBOARD = { area: '8.5', activeCrops: 4, tasksToday: 3, soilHealth: 92 }
const MOCK_PRICES = [
  { crop: 'Wheat', price: 2125, trend: 'up', percent: 2.3 },
  { crop: 'Mustard', price: 5450, trend: 'down', percent: 1.1 },
  { crop: 'Cotton', price: 6320, trend: 'up', percent: 0.8 },
  { crop: 'Moong', price: 7860, trend: 'up', percent: 1.6 },
]
const MOCK_KVK = {
  name: 'Krishi Vigyan Kendra',
  address: 'Narnaund Road, 125001',
  distance: 12,
  image: '/images/kvk_building.png'
}
const WEATHER_ICONS = {
  '01d': '☀️', '01n': '🌙', '02d': '⛅', '02n': '☁️',
  '03d': '☁️', '03n': '☁️', '04d': '☁️', '04n': '☁️',
  '09d': '🌧️', '09n': '🌧️', '10d': '🌦️', '10n': '🌧️',
  '11d': '⛈️', '11n': '⛈️', '13d': '❄️', '13n': '❄️',
  '50d': '🌫️', '50n': '🌫️',
}

export default function HomePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { t } = useTranslation()
  const [chatInput, setChatInput] = useState('')
  
  // States for dynamic data
  const [weather, setWeather] = useState(MOCK_WEATHER)
  const [diagnoses, setDiagnoses] = useState(MOCK_DIAGNOSES)
  const [lessons, setLessons] = useState(MOCK_LESSONS)
  const [dashboard, setDashboard] = useState(MOCK_DASHBOARD)
  const [marketPrices, setMarketPrices] = useState(MOCK_PRICES)
  const [kvk, setKvk] = useState(MOCK_KVK)
  const [tipOfDay, setTipOfDay] = useState("Spray jeevamrut early in the morning for better absorption and soil health.")

  const state = user?.state || 'Haryana'
  const district = user?.district || 'Hisar'

  useEffect(() => {
    weatherAPI.current(district).then(r => { if (r.data?.temperature) setWeather(r.data) }).catch(() => {})
    marketAPI.prices(state, district).then(r => { if (r.data?.length) setMarketPrices(r.data.slice(0, 4)) }).catch(() => {})
    dashboardAPI.get().then(r => { if (r.data?.area) setDashboard(r.data) }).catch(() => {})
    kvkAPI.nearby(state, district).then(r => { if (r.data?.length) setKvk(r.data[0]) }).catch(() => {})
    diseaseAPI.getHistory().then(r => { if (r.data?.length) setDiagnoses(r.data.slice(0, 3)) }).catch(() => {})
    learningAPI.lessons().then(r => { if (r.data?.length) setLessons(r.data.slice(0, 4)) }).catch(() => {})
    tipsAPI.daily().then(r => { if (r.data?.tip) setTipOfDay(r.data.tip) }).catch(() => {})
  }, [state, district])

  const handleChatSend = useCallback((input = chatInput) => {
    if (!input.trim()) return
    navigate('/assistant', { state: { initialMessage: input } })
    setChatInput('')
  }, [chatInput, navigate])

  return (
    <div className="grid-home page-enter" style={{ gridTemplateColumns: '1.8fr 1fr', gap: '24px' }}>
      {/* ─── Left Column ────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        
        {/* 1. Hero Section & 3. Quick Feature Cards */}
        <div style={{ position: 'relative' }}>
          <div className="hero-section" style={{
            background: 'linear-gradient(rgba(45, 106, 79, 0.85), rgba(20, 50, 35, 0.9)), url("https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop") center/cover',
            padding: '40px 32px',
            borderRadius: 'var(--radius-lg)',
            paddingBottom: '80px',
            color: 'white'
          }}>
            <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 12, lineHeight: 1.2 }}>{t('Smart Advice for')}<br/><span style={{ color: '#52B788' }}>{t('Stronger Harvests')}</span></h1>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.9)', maxWidth: 400, marginBottom: 28, lineHeight: 1.5 }}>
              {t('Voice-powered AI assistant for natural farming.')}<br/>Ask, learn and grow better – the natural way.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => navigate('/assistant')} className="btn" style={{ background: 'var(--green-primary)', color: 'white', padding: '10px 20px', borderRadius: 'var(--radius-full)' }}>
                <Mic size={18} /> {t('Talk to PrakritiAI')}
              </button>
              <button onClick={() => navigate('/disease')} className="btn" style={{ background: 'rgba(255,255,255,0.9)', color: 'var(--green-primary)', padding: '10px 20px', borderRadius: 'var(--radius-full)' }}>
                <Upload size={18} /> {t('Upload Plant Image')}
              </button>
            </div>
          </div>

          {/* Quick Feature Cards */}
          <div style={{ 
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, 
            marginTop: '-40px', padding: '0 20px', position: 'relative', zIndex: 10 
          }}>
            {[
              { icon: Leaf, label: 'Seed Advisor', desc: 'Get crop & seed recommendations', path: '/seeds' },
              { icon: Building2, label: 'Government Schemes', desc: 'Find subsidies & financial support', path: '/schemes' },
              { icon: Cloud, label: 'Weather Updates', desc: 'Real-time weather & farm alerts', path: '/weather' },
              { icon: TrendingUp, label: 'Market Prices', desc: 'Check mandi prices & trends', path: '/market' },
            ].map((f, i) => (
              <div key={i} onClick={() => navigate(f.path)} className="card hover-card" style={{ background: 'white', padding: 16, borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow)', cursor: 'pointer' }}>
                <div style={{ color: 'var(--green-primary)', marginBottom: 8 }}><f.icon size={24} /></div>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4, color: 'var(--gray-900)' }}>{t(f.label)}</div>
                <div style={{ fontSize: 11, color: 'var(--gray-500)', lineHeight: 1.4 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Crop Doctor Module */}
        <div className="card" style={{ padding: 24, background: 'white', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--gray-900)' }}>{t('Crop Doctor')}</h2>
              <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>Upload a leaf or plant image to detect issues and get natural solutions.</p>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24 }}>
            <div onClick={() => navigate('/disease')} style={{ border: '2px dashed var(--gray-200)', borderRadius: 'var(--radius-md)', padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', cursor: 'pointer' }} className="hover-card">
              <div style={{ background: 'var(--green-pale)', padding: 12, borderRadius: '50%', color: 'var(--green-primary)', marginBottom: 12 }}><Camera size={32} /></div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-800)' }}>Upload or Capture</div>
              <div style={{ fontSize: 11, color: 'var(--gray-500)', marginBottom: 16 }}>JPG, PNG up to 10MB</div>
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Open Camera</button>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-700)' }}>Recent Diagnoses</span>
                <span onClick={() => navigate('/disease')} style={{ fontSize: 13, color: 'var(--green-medium)', fontWeight: 600, cursor: 'pointer' }}>View all</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {diagnoses.map((d, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-md)' }}>
                    <img src={d.image_url} alt={d.disease_name} style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-900)' }}>{d.disease_name}</div>
                      <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>Confidence: {d.confidence}%</div>
                    </div>
                    <div style={{ background: 'var(--green-pale)', color: 'var(--green-primary)', fontSize: 11, fontWeight: 600, padding: '4px 8px', borderRadius: 4 }}>Treatment Provided</div>
                    <ChevronRight size={16} color="var(--gray-400)" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 5. Learning Center */}
        <div className="card" style={{ padding: 24, background: 'white', borderRadius: 'var(--radius-lg)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--gray-900)' }}>{t('Learn Natural Farming')}</h2>
          <p style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 20 }}>Explore topics and practices for a healthier farm</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {lessons.map((topic, i) => (
              <div key={i} onClick={() => navigate('/learn')} style={{ border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-md)', overflow: 'hidden', cursor: 'pointer' }} className="hover-card">
                <img src={topic.cover_image} alt={topic.title} style={{ width: '100%', height: 100, objectFit: 'cover' }} />
                <div style={{ padding: 12 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4, color: 'var(--gray-900)' }}>{topic.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--gray-500)', marginBottom: 12, lineHeight: 1.4 }}>{topic.description}</div>
                  <div style={{ fontSize: 11, color: 'var(--gray-400)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={12} /> {topic.read_time}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'right', marginTop: 16 }}>
             <span onClick={() => navigate('/learn')} style={{ fontSize: 13, color: 'var(--green-medium)', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}>Explore all topics <ArrowRight size={14} /></span>
          </div>
        </div>

        {/* 6. My Farm Dashboard */}
        <div className="card" style={{ padding: 24, background: 'white', borderRadius: 'var(--radius-lg)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--gray-900)' }}>{t('My Farm Dashboard')}</h2>
          <p style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 20 }}>Your quick farm overview</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            <div style={{ padding: 16, border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ color: 'var(--green-primary)', marginBottom: 8 }}><MapPin size={24} /></div>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--gray-900)' }}>{dashboard.area} <span style={{ fontSize: 14, fontWeight: 500 }}>acres</span></div>
              <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>Total Farm Area</div>
              <div style={{ fontSize: 11, color: 'var(--green-medium)', marginTop: 8 }}>Active Profile</div>
            </div>
            
            <div style={{ padding: 16, border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ color: '#3B82F6', marginBottom: 8 }}><Leaf size={24} /></div>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--gray-900)' }}>{dashboard.activeCrops}</div>
              <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>Active Crops</div>
              <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 8 }}>Tracked in system</div>
            </div>

            <div style={{ padding: 16, border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ color: '#F59E0B', marginBottom: 8 }}><CheckCircle2 size={24} /></div>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--gray-900)' }}>{dashboard.tasksToday}</div>
              <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>Tasks Today</div>
              <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 8 }}>Pending tasks</div>
            </div>

            <div style={{ padding: 16, border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ color: 'var(--green-primary)', marginBottom: 8 }}><TrendingUp size={24} /></div>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--gray-900)' }}>{dashboard.soilHealth}%</div>
              <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>Soil Health Score</div>
              <div style={{ fontSize: 11, color: 'var(--green-medium)', marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>Good <div style={{ width: 8, height: 8, background: 'var(--green-medium)', borderRadius: '50%' }}></div></div>
            </div>
          </div>
        </div>

        {/* 7. Help Banner */}
        <div className="card" style={{ background: 'var(--green-bg)', border: '1px solid var(--green-pale)', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: 'var(--radius-md)' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
             <div style={{ background: 'white', padding: 12, borderRadius: '50%', color: 'var(--green-primary)' }}>
               <Phone size={24} />
             </div>
             <div>
               <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--green-primary)', marginBottom: 4 }}>Need Help? We are here for you!</div>
               <div style={{ fontSize: 13, color: 'var(--gray-600)' }}>Talk to our support team or call our helpline for assistance.</div>
             </div>
           </div>
           <button className="btn" style={{ background: 'white', border: '1px solid var(--green-pale)', color: 'var(--green-primary)', fontWeight: 600, padding: '10px 20px', borderRadius: 'var(--radius-full)' }}>
             <Phone size={16} /> Call Helpline
           </button>
        </div>

      </div>

      {/* ─── Right Column ───────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        
        {/* 8. Weather Widget */}
        <div onClick={() => navigate('/weather')} className="card weather-card hover-card" style={{ padding: 24, border: '1px solid var(--gray-200)', background: 'white', borderRadius: 'var(--radius-lg)', cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--gray-900)', marginBottom: 2 }}>{t('Weather Today')}</div>
              <div style={{ fontSize: 13, color: 'var(--gray-500)' }}>{weather?.city || district}, {weather?.country || state}</div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
               <div style={{ fontSize: 50 }}>{WEATHER_ICONS[weather?.icon] || '🌤️'}</div>
               <div>
                  <div style={{ fontSize: 40, fontWeight: 800, lineHeight: 1, color: 'var(--gray-900)' }}>{weather?.temperature}°<span style={{ fontSize: 20, fontWeight: 600 }}>C</span></div>
                  <div style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 4, textTransform: 'capitalize' }}>{weather?.description}</div>
               </div>
            </div>
            <div style={{ fontSize: 12, color: 'var(--gray-600)', display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
              <div style={{ display: 'flex', gap: 24, justifyContent: 'space-between' }}><span>{t('Humidity')}</span> <span style={{ fontWeight: 600, color: 'var(--gray-900)' }}>{weather?.humidity}%</span></div>
              <div style={{ display: 'flex', gap: 24, justifyContent: 'space-between' }}><span>{t('Wind')}</span> <span style={{ fontWeight: 600, color: 'var(--gray-900)' }}>{weather?.wind_speed} km/h</span></div>
              <div style={{ display: 'flex', gap: 24, justifyContent: 'space-between' }}><span>{t('Rain Chance')}</span> <span style={{ fontWeight: 600, color: 'var(--gray-900)' }}>{weather?.rain_chance}%</span></div>
            </div>
          </div>

          {/* 5-Day Forecast */}
          {weather?.forecast?.length > 0 && (
            <div className="weather-forecast" style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--gray-100)', paddingTop: 16, marginBottom: 16 }}>
              {weather.forecast.slice(0, 5).map((f, i) => (
                <div key={i} className="forecast-day" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{f.day}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray-800)', marginTop: 4 }}>{f.high}°<span style={{ color: 'var(--gray-400)', fontWeight: 500 }}>/{f.low}°</span></div>
                  <div style={{ fontSize: 20 }}>{WEATHER_ICONS[f.icon] || '🌤️'}</div>
                </div>
              ))}
            </div>
          )}

          <div style={{ textAlign: 'right' }}>
             <span style={{ fontSize: 12, color: 'var(--green-medium)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>{t('View full forecast')} <ArrowRight size={14} /></span>
          </div>
        </div>

        {/* 9. Market Prices Widget */}
        <div onClick={() => navigate('/market')} className="card hover-card" style={{ padding: 24, border: '1px solid var(--gray-200)', background: 'white', borderRadius: 'var(--radius-lg)', cursor: 'pointer' }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--gray-900)', marginBottom: 2 }}>{t('Market Prices (Today)')}</div>
          <div style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 16 }}>{district} Mandi</div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
             {marketPrices.map((m, i) => (
               <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 12, borderBottom: i < marketPrices.length - 1 ? '1px solid var(--gray-100)' : 'none' }}>
                 <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--gray-800)' }}>{m.crop}</div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                   <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-900)' }}>₹{m.price} <span style={{ fontSize: 11, color: 'var(--gray-400)', fontWeight: 400 }}>/ Quintal</span></div>
                   <div style={{ fontSize: 12, fontWeight: 600, color: m.trend === 'up' ? 'var(--green-medium)' : 'var(--red)', display: 'flex', alignItems: 'center', gap: 2 }}>
                     {m.trend === 'up' ? '↑' : '↓'} {m.percent}%
                   </div>
                 </div>
               </div>
             ))}
          </div>
          
          <div style={{ textAlign: 'right', marginTop: 12 }}>
             <span style={{ fontSize: 12, color: 'var(--green-medium)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>{t('View all prices')} <ArrowRight size={14} /></span>
          </div>
        </div>

        {/* 10. Ask PrakritiAI */}
        <div className="card" style={{ padding: 24, border: '1px solid var(--gray-200)', background: 'white', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--gray-900)', marginBottom: 2 }}>{t('Ask PrakritiAI')}</div>
          <div style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 20 }}>Your voice assistant for farming</div>
          
          <div style={{ background: 'var(--green-bg)', borderRadius: 'var(--radius-md)', padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 20 }}>
             <div style={{ fontSize: 13, color: 'var(--green-primary)', fontWeight: 500, marginBottom: 16 }}>Tap the mic and ask anything...</div>
             <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginBottom: 20, height: 24 }}>
               {[1, 2, 4, 3, 5, 2, 1, 3, 4, 2, 1, 3, 5, 4, 2].map((v, i) => (
                 <div key={i} style={{ width: 3, height: v * 4, background: 'var(--green-light)', borderRadius: 2 }}></div>
               ))}
             </div>
             <button onClick={() => navigate('/assistant')} style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--green-primary)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--shadow-md)' }}>
               <Mic size={24} />
             </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              "Which crop should I grow this season?",
              "How to make jeevamrut?",
              "Why are my leaves turning yellow?",
              "Tell me about PM-KISAN scheme"
            ].map((q, i) => (
               <div key={i} onClick={() => handleChatSend(q)} style={{ background: 'var(--gray-50)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', fontSize: 13, color: 'var(--gray-700)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                 {q}
                 <ArrowRight size={14} color="var(--gray-400)" />
               </div>
            ))}
          </div>
        </div>

        {/* 11. Tip of the Day */}
        <div className="card" style={{ 
          background: 'linear-gradient(rgba(240, 250, 244, 0.95), rgba(240, 250, 244, 0.85)), url("https://images.unsplash.com/photo-1595841696677-6477b649d21e?w=600&fit=crop") bottom/cover',
          border: '1px solid var(--green-pale)', borderRadius: 'var(--radius-lg)', padding: 24, position: 'relative', overflow: 'hidden' 
        }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--green-primary)', fontWeight: 700, fontSize: 16, marginBottom: 12 }}>
             <Leaf size={20} /> {t('Tip of the Day')}
           </div>
           <div style={{ fontSize: 14, color: 'var(--gray-800)', lineHeight: 1.6, maxWidth: '70%', marginBottom: 16 }}>
             {tipOfDay}
           </div>
           <img src="/images/farmer_illustration.png" alt="Farmer" style={{ position: 'absolute', right: -20, bottom: -20, height: 160 }} />
           
           <div style={{ textAlign: 'right', marginTop: 12 }}>
             <span style={{ fontSize: 12, color: 'var(--green-primary)', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}>View more tips <ArrowRight size={14} /></span>
          </div>
        </div>

        {/* 12. Nearby KVK */}
        {kvk && (
          <div className="card" style={{ padding: 24, border: '1px solid var(--gray-200)', background: 'white', borderRadius: 'var(--radius-lg)' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--gray-900)', fontWeight: 700, fontSize: 16, marginBottom: 16 }}>
               <Building2 size={20} color="var(--green-medium)" /> {t('Nearby KVK')}
             </div>
             <div style={{ display: 'flex', gap: 16 }}>
               <img src={kvk.image || '/images/kvk_building.png'} alt="KVK" style={{ width: 80, height: 80, borderRadius: 8, objectFit: 'cover' }} />
               <div>
                 <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-900)', marginBottom: 4 }}>{kvk.name || 'Krishi Vigyan Kendra'}, {district}</div>
                 <div style={{ fontSize: 12, color: 'var(--gray-500)', lineHeight: 1.4, marginBottom: 8 }}>{kvk.address || `${district}, ${state}`}</div>
                 <div style={{ fontSize: 12, color: 'var(--green-medium)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                   <MapPin size={12} /> {kvk.distance || 12} km away
                 </div>
               </div>
             </div>
             <div style={{ textAlign: 'right', marginTop: 16 }}>
               <span style={{ fontSize: 12, color: 'var(--gray-500)', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}>View all centers <ArrowRight size={14} /></span>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
