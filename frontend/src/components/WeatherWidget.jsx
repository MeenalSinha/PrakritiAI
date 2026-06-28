import { useEffect, useState } from 'react'
import { Cloud, Wind, Droplets, Sun } from 'lucide-react'
import { weatherAPI } from '../utils/api'
import { useAuth } from '../context/AuthContext'

const weatherIcons = {
  '01d': '☀️', '01n': '🌙', '02d': '⛅', '02n': '⛅',
  '03d': '☁️', '03n': '☁️', '04d': '☁️', '04n': '☁️',
  '09d': '🌧️', '09n': '🌧️', '10d': '🌦️', '10n': '🌧️',
  '11d': '⛈️', '11n': '⛈️', '13d': '❄️', '13n': '❄️',
  '50d': '🌫️', '50n': '🌫️',
}

export default function WeatherWidget({ compact = false }) {
  const { user } = useAuth()
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const city = user?.district || user?.state || 'Hisar'
    weatherAPI.current(city)
      .then(r => setWeather(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user])

  if (loading) {
    return (
      <div className="card">
        <div className="skeleton" style={{ height: 20, width: '60%', marginBottom: 12 }} />
        <div className="skeleton" style={{ height: 48, width: '40%', marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 16, width: '80%' }} />
      </div>
    )
  }

  if (!weather) return null

  if (compact) {
    return (
      <div className="flex items-center gap-12">
        <span style={{ fontSize: 22 }}>{weatherIcons[weather.icon] || '🌤️'}</span>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{weather.temperature}°C</div>
          <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{weather.city}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="card weather-card">
      <div className="flex justify-between items-center">
        <div>
          <div className="section-title">Weather Today</div>
          <div className="text-sm text-gray">{weather.city}, {weather.country || 'IN'}</div>
        </div>
        <span style={{ fontSize: 28 }}>{weatherIcons[weather.icon] || '🌤️'}</span>
      </div>

      <div className="weather-main">
        <div>
          <div className="weather-temp">{weather.temperature}<sup>°C</sup></div>
          <div style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 4 }}>{weather.description}</div>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <div className="weather-meta-item">
            <span className="weather-meta-label">Humidity</span>
            <span className="weather-meta-value">{weather.humidity}%</span>
          </div>
          <div className="weather-meta-item">
            <span className="weather-meta-label">Wind</span>
            <span className="weather-meta-value">{weather.wind_speed} km/h</span>
          </div>
          <div className="weather-meta-item">
            <span className="weather-meta-label">Rain Chance</span>
            <span className="weather-meta-value">{weather.rain_chance}%</span>
          </div>
        </div>
      </div>

      {weather.forecast?.length > 0 && (
        <div className="weather-forecast">
          {weather.forecast.slice(0, 5).map((d, i) => (
            <div key={i} className="forecast-day">
              <span className="day-name">{d.day}</span>
              <span style={{ fontSize: 18 }}>{weatherIcons[d.icon] || '⛅'}</span>
              <span className="day-temp">{d.high}°/{d.low}°</span>
            </div>
          ))}
        </div>
      )}

      {weather.farming_advice && (
        <div style={{
          marginTop: 12, padding: '10px 14px',
          background: 'var(--green-bg)', borderRadius: 'var(--radius-sm)',
          fontSize: 13, color: 'var(--green-primary)', lineHeight: 1.5,
          borderLeft: '3px solid var(--green-medium)'
        }}>
          {weather.farming_advice}
        </div>
      )}

      {weather.source === 'demo' && (
        <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 8, textAlign: 'right' }}>
          Sample data. Add OpenWeather API key for live weather.
        </div>
      )}
    </div>
  )
}
