// Weather Page — Full-featured weather + farming intelligence
import { useState, useEffect, useCallback } from 'react'
import { Search, MapPin, Wind, Droplets, Eye, Gauge, AlertTriangle, Thermometer, Sun } from 'lucide-react'
import { weatherAPI } from '../utils/api'
import { useAuth } from '../context/AuthContext'

const WEATHER_ICONS = {
  '01d': '☀️', '01n': '🌙', '02d': '⛅', '02n': '☁️',
  '03d': '☁️', '03n': '☁️', '04d': '☁️', '04n': '☁️',
  '09d': '🌧️', '09n': '🌧️', '10d': '🌦️', '10n': '🌧️',
  '11d': '⛈️', '11n': '⛈️', '13d': '❄️', '13n': '❄️',
  '50d': '🌫️', '50n': '🌫️',
}

const COMMON_CITIES = [
  'Delhi', 'Mumbai', 'Lucknow', 'Patna', 'Nagpur',
  'Ludhiana', 'Jaipur', 'Bhopal', 'Hyderabad', 'Pune'
]

function WeatherDetailItem({ icon, label, value, unit = '' }) {
  return (
    <div className="weather-detail-item">
      <div style={{ fontSize: 20, marginBottom: 4 }}>{icon}</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: 'white', lineHeight: 1 }}>{value}<span style={{ fontSize: 13, fontWeight: 400, marginLeft: 2 }}>{unit}</span></div>
      <div style={{ fontSize: 11, opacity: 0.75, marginTop: 2 }}>{label}</div>
    </div>
  )
}

function ForecastCard({ day }) {
  const icon = WEATHER_ICONS[day.icon] || '🌤️'
  return (
    <div className="weather-forecast-card">
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-500)', marginBottom: 8 }}>{day.day}</div>
      <div style={{ fontSize: 26, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 6 }}>{day.description}</div>
      <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--gray-800)' }}>{day.high}°</div>
      <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{day.low}°</div>
    </div>
  )
}

function SkeletonWeather() {
  return (
    <div>
      <div className="weather-current">
        <div className="skeleton skeleton-title" style={{ width: '40%', background: 'rgba(255,255,255,0.2)' }} />
        <div className="skeleton" style={{ height: 60, width: '50%', marginTop: 12, background: 'rgba(255,255,255,0.2)' }} />
        <div className="skeleton skeleton-text" style={{ width: '70%', marginTop: 12, background: 'rgba(255,255,255,0.2)' }} />
      </div>
      <div className="grid-4" style={{ gap: 12 }}>
        {[1,2,3,4,5].map(i => (
          <div key={i} className="skeleton skeleton-card" style={{ height: 100 }} />
        ))}
      </div>
    </div>
  )
}

export default function WeatherPage() {
  const { user } = useAuth()
  const [city, setCity] = useState(user?.state?.split(',')[0] || '')
  const [searchInput, setSearchInput] = useState('')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [locationLoading, setLocationLoading] = useState(false)

  const fetchWeather = useCallback(async (cityName, lat, lon) => {
    setLoading(true)
    setError(null)
    try {
      const res = await weatherAPI.current(cityName, lat, lon)
      setWeather(res.data)
      if (cityName) setCity(cityName)
    } catch (e) {
      setError('Mausam ki jaankari laane mein dikkat hui. Thodi der baad dobara try karein.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const initialCity = user?.state || 'Delhi'
    fetchWeather(initialCity)
  }, [])

  const handleSearch = () => {
    if (!searchInput.trim()) return
    fetchWeather(searchInput.trim())
    setSearchInput('')
  }

  const handleGeoLocation = () => {
    if (!navigator.geolocation) {
      setError('Aapka browser GPS support nahi karta.')
      return
    }
    setLocationLoading(true)
    navigator.geolocation.getCurrentPosition(
      pos => {
        setLocationLoading(false)
        fetchWeather('', pos.coords.latitude, pos.coords.longitude)
      },
      () => {
        setLocationLoading(false)
        setError('GPS permission nahi mili. Please browser mein location allow karein.')
      }
    )
  }

  const getFarmingAlertColor = (advice) => {
    if (!advice) return null
    if (advice.toLowerCase().includes('baarish') || advice.toLowerCase().includes('rain')) return '#dbeafe'
    if (advice.toLowerCase().includes('garmi') || advice.toLowerCase().includes('hot')) return '#fee2e2'
    if (advice.toLowerCase().includes('sardi') || advice.toLowerCase().includes('cold')) return '#eff6ff'
    return 'var(--green-bg)'
  }

  const wxIcon = weather ? (WEATHER_ICONS[weather.icon] || '🌤️') : '🌤️'

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <div className="page-title">🌦️ Mausam Jaankari</div>
        <div className="page-subtitle">Real-time mausam aur fasal ke liye khas salaah</div>
      </div>

      {/* Search + Location Row */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <Search size={16} color="var(--gray-400)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            id="weather-city-search"
            className="form-input"
            style={{ paddingLeft: 40 }}
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Sheher ka naam likhein... Delhi, Patna, Nagpur"
            aria-label="Search for weather by city name"
          />
        </div>
        <button
          id="weather-search-btn"
          className="btn btn-primary"
          onClick={handleSearch}
          disabled={!searchInput.trim() || loading}
          aria-label="Search weather"
        >
          <Search size={15} /> Khojein
        </button>
        <button
          id="weather-location-btn"
          className="btn btn-secondary"
          onClick={handleGeoLocation}
          disabled={locationLoading || loading}
          aria-label="Use my current location for weather"
          title="Meri location use karein"
        >
          <MapPin size={15} />
          {locationLoading ? 'Loading...' : 'Meri Location'}
        </button>
      </div>

      {/* Quick City Chips */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {COMMON_CITIES.map(c => (
          <button
            key={c}
            onClick={() => fetchWeather(c)}
            style={{
              fontSize: 12, padding: '5px 12px',
              background: city === c ? 'var(--green-primary)' : 'var(--gray-100)',
              color: city === c ? 'white' : 'var(--gray-600)',
              border: 'none', borderRadius: 'var(--radius-full)',
              cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 500,
              transition: 'all 0.15s',
            }}
            aria-label={`Show weather for ${c}`}
            aria-pressed={city === c}
          >
            {c}
          </button>
        ))}
      </div>

      {error && (
        <div className="browser-warning" role="alert">
          <AlertTriangle size={16} color="var(--yellow)" style={{ flexShrink: 0 }} />
          {error}
        </div>
      )}

      {loading ? (
        <SkeletonWeather />
      ) : weather ? (
        <>
          {/* Current Weather Card */}
          <div className="weather-current" role="region" aria-label="Current weather conditions">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <MapPin size={14} opacity={0.7} />
                  <span style={{ fontSize: 16, fontWeight: 600, opacity: 0.9 }}>{weather.city}, {weather.country}</span>
                  {weather.source === 'demo' && (
                    <span className="data-source-badge demo" style={{ background: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.3)' }}>
                      Sample Data
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
                  <div style={{ fontSize: 56, lineHeight: 1 }}>{wxIcon}</div>
                  <div>
                    <div style={{ fontSize: 52, fontWeight: 800, lineHeight: 1 }}>{weather.temperature}°C</div>
                    <div style={{ fontSize: 15, opacity: 0.8, marginTop: 2 }}>Feels like {weather.feels_like}°C</div>
                  </div>
                </div>
                <div style={{ fontSize: 16, opacity: 0.85, marginTop: 8, textTransform: 'capitalize' }}>
                  {weather.description}
                </div>
              </div>

              {/* Rain chance */}
              <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 'var(--radius-md)', padding: '16px 20px', textAlign: 'center', minWidth: 120, backdropFilter: 'blur(8px)' }}>
                <div style={{ fontSize: 32 }}>🌧️</div>
                <div style={{ fontSize: 28, fontWeight: 800 }}>{weather.rain_chance}%</div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>Baarish ki sambhavna</div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="weather-detail-grid">
              <WeatherDetailItem icon="💧" label="Nami (Humidity)" value={weather.humidity} unit="%" />
              <WeatherDetailItem icon="💨" label="Hawa ki Gati" value={weather.wind_speed} unit=" km/h" />
              <WeatherDetailItem icon="👁️" label="Drishyata" value={weather.visibility ? Math.round(weather.visibility / 1000) : '—'} unit=" km" />
              <WeatherDetailItem icon="⚡" label="Vayu Daab" value={weather.pressure} unit=" hPa" />
            </div>
          </div>

          {/* Farming Advice Banner */}
          {weather.farming_advice && (
            <div style={{
              background: getFarmingAlertColor(weather.farming_advice),
              border: '1px solid var(--green-pale)',
              borderRadius: 'var(--radius-md)',
              padding: '16px 20px',
              marginBottom: 20,
              display: 'flex', gap: 12, alignItems: 'flex-start'
            }} role="complementary" aria-label="Farming advice based on current weather">
              <div style={{ fontSize: 24, flexShrink: 0 }}>🌾</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--green-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                  Aaj ki Kheti Salaah
                </div>
                <div style={{ fontSize: 14, color: 'var(--gray-700)', lineHeight: 1.6 }}>
                  {weather.farming_advice}
                </div>
              </div>
            </div>
          )}

          {/* 5-Day Forecast */}
          {weather.forecast?.length > 0 && (
            <div className="card" style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--gray-800)', marginBottom: 16 }}>
                📅 5-Din ka Mausam Purvanuman
              </div>
              <div className="grid-4" style={{ gridTemplateColumns: `repeat(${weather.forecast.length}, 1fr)`, gap: 10 }}>
                {weather.forecast.map((day, i) => (
                  <ForecastCard key={i} day={day} />
                ))}
              </div>
            </div>
          )}

          {/* Farming Weather Calendar */}
          <div className="card">
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--gray-800)', marginBottom: 16 }}>
              🌾 Maasik Kheti Calendar
            </div>
            <div className="grid-2" style={{ gap: 12 }}>
              {[
                { month: 'June–July', activity: 'Kharif buwai ka mausam. Baarish ki garmi se pahle buwai karein. Jeevamrut tayyar rakhein.', color: '#E8F5E9' },
                { month: 'Aug–Sept', activity: 'Barishon ka thaan. Fungal bimaariyon ka dhyan rakhein. Khet mein kaam kam karein.', color: '#DBEAFE' },
                { month: 'Oct–Nov', activity: 'Rabi buwai. Mitti ki nami check karein. Buwai ke baad Jeevamrut lagaayein.', color: '#FFF7ED' },
                { month: 'Dec–Feb', activity: 'Sheethlahar se fasal bachaayen. Paale se suraksha karein. Sinchai ka dhyan rakhein.', color: '#EFF6FF' },
                { month: 'Mar–Apr', activity: 'Rabi katai. Zaid/Kharif ki taiyaari karein. Khet mein jaivik khaad mein milaayein.', color: '#F3E5F5' },
                { month: 'May', activity: 'Garmi zyada. Kam kaam karein. Mitti ko jaivik padaardh se dhakein.', color: '#FEF2F2' },
              ].map(({ month, activity, color }) => (
                <div
                  key={month}
                  style={{ padding: '14px 16px', background: color, borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,0,0,0.05)' }}
                >
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--green-primary)', marginBottom: 4 }}>{month}</div>
                  <div style={{ fontSize: 13, color: 'var(--gray-600)', lineHeight: 1.5 }}>{activity}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">
            <span style={{ fontSize: 32 }}>🌤️</span>
          </div>
          <div className="empty-state-title">Sheher khojein</div>
          <div className="empty-state-desc">Apna sheher likhein ya GPS button dabaayen mausam jaanne ke liye</div>
        </div>
      )}
    </div>
  )
}
