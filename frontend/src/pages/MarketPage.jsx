import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, Minus, RefreshCw } from 'lucide-react'
import { marketAPI } from '../utils/api'
import { useAuth } from '../context/AuthContext'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const INDIAN_STATES = ['Haryana','Punjab','Maharashtra','Uttar Pradesh','Madhya Pradesh','Gujarat','Rajasthan','Bihar']

export default function MarketPage() {
  const { user } = useAuth()
  const [state, setState] = useState(user?.state || 'Haryana')
  const [district, setDistrict] = useState(user?.district || 'Hisar')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [cropDetail, setCropDetail] = useState(null)

  const fetchPrices = () => {
    setLoading(true)
    marketAPI.prices(state, district)
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchPrices() }, [])

  const selectCrop = (crop) => {
    setSelected(crop.crop)
    marketAPI.cropDetail(crop.crop).then(r => setCropDetail(r.data)).catch(() => {})
  }

  const TrendIcon = ({ trend }) => {
    if (trend === 'up') return <TrendingUp size={14} color="var(--green-medium)" />
    if (trend === 'down') return <TrendingDown size={14} color="var(--red)" />
    return <Minus size={14} color="var(--gray-400)" />
  }

  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <div className="page-title">Market Intelligence</div>
        <div className="page-subtitle">Mandi prices, trends, and best selling advice for your region</div>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 20, padding: '14px 20px' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ flex: 1, minWidth: 140 }}>
            <label className="form-label">State</label>
            <select className="form-select" value={state} onChange={e => setState(e.target.value)}>
              {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ flex: 1, minWidth: 140 }}>
            <label className="form-label">District / Mandi</label>
            <input className="form-input" value={district} onChange={e => setDistrict(e.target.value)} placeholder="e.g. Hisar" />
          </div>
          <button className="btn btn-primary" style={{ marginTop: 18 }} onClick={fetchPrices}>
            <RefreshCw size={15} /> Update Prices
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <span className="loading-spinner" style={{ width: 32, height: 32 }} />
          <div style={{ marginTop: 12, color: 'var(--gray-500)' }}>Fetching mandi prices...</div>
        </div>
      ) : data && (
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 360px' : '1fr', gap: 20 }}>
          {/* Price Table */}
          <div>
            <div className="card" style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <div>
                  <div className="section-title">{data.mandi}</div>
                  <div className="section-subtitle">Last updated: {data.last_updated}</div>
                </div>
                {data.source === 'demo' && (
                  <span className="badge badge-gray">Sample Data</span>
                )}
              </div>
            </div>

            {data.best_selling_advice && (
              <div style={{ padding: '12px 16px', background: 'var(--green-bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--green-pale)', marginBottom: 16, fontSize: 13, color: 'var(--green-primary)', lineHeight: 1.55 }}>
                <strong>Market Advice: </strong>{data.best_selling_advice}
              </div>
            )}

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '12px 20px', background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)', display: 'grid', gridTemplateColumns: '1fr 120px 100px 80px', gap: 8 }}>
                {['Crop', 'Price / Quintal', 'Change', 'Demand'].map(h => (
                  <div key={h} style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</div>
                ))}
              </div>
              {data.prices?.map((p, i) => (
                <div
                  key={i}
                  onClick={() => selectCrop(p)}
                  style={{
                    padding: '12px 20px',
                    borderBottom: '1px solid var(--gray-100)',
                    display: 'grid', gridTemplateColumns: '1fr 120px 100px 80px',
                    gap: 8, cursor: 'pointer', alignItems: 'center',
                    background: selected === p.crop ? 'var(--green-bg)' : 'white',
                    transition: 'background 0.15s'
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-800)' }}>{p.crop}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>Rs. {p.price?.toLocaleString('en-IN')}</div>
                    <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>Min: {(p.min_price)?.toLocaleString('en-IN')} | Max: {(p.max_price)?.toLocaleString('en-IN')}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <TrendIcon trend={p.trend} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: p.trend === 'up' ? 'var(--green-medium)' : p.trend === 'down' ? 'var(--red)' : 'var(--gray-500)' }}>
                      {p.change_percent > 0 ? '+' : ''}{p.change_percent}%
                    </span>
                  </div>
                  <span className={`badge ${p.demand === 'High' ? 'badge-green' : p.demand === 'Low' ? 'badge-red' : 'badge-gray'}`} style={{ fontSize: 11 }}>
                    {p.demand}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Crop Detail Chart */}
          {selected && cropDetail && (
            <div style={{ position: 'sticky', top: 80 }}>
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>{cropDetail.crop}</div>
                    <div style={{ fontSize: 13, color: 'var(--gray-500)' }}>30-day price trend</div>
                  </div>
                  <button onClick={() => { setSelected(null); setCropDetail(null) }} style={{ background: 'none', border: 'none', color: 'var(--gray-400)', cursor: 'pointer', fontSize: 18 }}>x</button>
                </div>

                <div style={{ marginBottom: 16, padding: '12px 14px', background: 'var(--green-bg)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--green-primary)' }}>
                    Rs. {cropDetail.current_price?.toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2 }}>Current price / Quintal</div>
                </div>

                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={cropDetail.price_history_30d}>
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={6} />
                    <YAxis tick={{ fontSize: 10 }} domain={['auto', 'auto']} />
                    <Tooltip formatter={v => `Rs. ${v}`} />
                    <Line type="monotone" dataKey="price" stroke="var(--green-primary)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>

                <div style={{ marginTop: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-700)', marginBottom: 4 }}>Selling Advice</div>
                  <div style={{ fontSize: 13, color: 'var(--gray-600)', padding: '10px 12px', background: 'var(--gray-50)', borderRadius: 'var(--radius-sm)' }}>
                    {cropDetail.best_time_to_sell}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
