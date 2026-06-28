import { useState } from 'react'
import { Sprout, Droplets, TrendingUp, ChevronDown } from 'lucide-react'
import { seedAPI } from '../utils/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const INDIAN_STATES = [
  'Andhra Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana',
  'Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra',
  'Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim',
  'Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal'
]

const SOIL_TYPES = ['Black Cotton','Red Loamy','Sandy Loam','Clay','Alluvial','Laterite','Desert Sandy','Mountain']
const SEASONS = ['Kharif (June-Oct)','Rabi (Oct-Mar)','Zaid (Mar-June)']
const WATER = ['Rain-fed Only','Low (Well/Borewell)','Medium (Canal)','High (Assured Irrigation)']
const DIFFICULTY_COLORS = { Easy: 'badge-green', Medium: 'badge-orange', Hard: 'badge-red' }

function ScoreBar({ score }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 6, background: 'var(--gray-100)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${score}%`, background: score > 80 ? 'var(--green-medium)' : score > 60 ? 'var(--yellow)' : 'var(--orange)', borderRadius: 3, transition: 'width 1s ease' }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-600)', minWidth: 32 }}>{score}%</span>
    </div>
  )
}

export default function SeedsPage() {
  const { user } = useAuth()
  const [form, setForm] = useState({
    state: user?.state || 'Haryana',
    district: user?.district || '',
    season: 'Kharif (June-Oct)',
    soil_type: 'Black Cotton',
    farm_size: 2,
    water_availability: 'Medium (Canal)',
    budget: '10000',
    preferred_crop: ''
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const submit = async () => {
    setLoading(true)
    try {
      const payload = {
        ...form,
        season: form.season.split(' ')[0],
        water_availability: form.water_availability.split(' ')[0],
      }
      const r = await seedAPI.recommend(payload)
      if (r.data.success) {
        setResult(r.data.result)
        toast.success('Recommendations ready!')
      } else {
        toast.error('Could not generate recommendations. Please try again.')
      }
    } catch {
      toast.error('Network error. Please check connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <div className="page-title">Seed Advisor</div>
        <div className="page-subtitle">Get personalized crop and seed recommendations for your farm</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: result ? '380px 1fr' : '1fr', gap: 20 }}>
        {/* Form */}
        <div className="card">
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--gray-800)', marginBottom: 18 }}>
            Your Farm Details
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="grid-2" style={{ gap: 12 }}>
              <div className="form-group">
                <label className="form-label">State</label>
                <select className="form-select" value={form.state} onChange={e => set('state', e.target.value)}>
                  {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">District</label>
                <input className="form-input" value={form.district} onChange={e => set('district', e.target.value)} placeholder="e.g. Hisar" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Season</label>
              <select className="form-select" value={form.season} onChange={e => set('season', e.target.value)}>
                {SEASONS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Soil Type</label>
              <select className="form-select" value={form.soil_type} onChange={e => set('soil_type', e.target.value)}>
                {SOIL_TYPES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div className="grid-2" style={{ gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Farm Size (acres)</label>
                <input className="form-input" type="number" min="0.5" step="0.5" value={form.farm_size} onChange={e => set('farm_size', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Budget / Acre</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: 'var(--gray-500)' }}>Rs.</span>
                  <input className="form-input" style={{ paddingLeft: 36 }} type="number" min="1000" step="500" value={form.budget} onChange={e => set('budget', e.target.value)} />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Water Availability</label>
              <select className="form-select" value={form.water_availability} onChange={e => set('water_availability', e.target.value)}>
                {WATER.map(w => <option key={w}>{w}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Preferred Crop (optional)</label>
              <input className="form-input" value={form.preferred_crop} onChange={e => set('preferred_crop', e.target.value)} placeholder="e.g. Wheat, Cotton, Tomato..." />
            </div>

            <button onClick={submit} className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 4 }} disabled={loading}>
              {loading ? <><span className="loading-spinner" style={{ width: 18, height: 18 }} /> Getting Recommendations...</> : <><Sprout size={16} /> Get Recommendations</>}
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Crop Cards */}
            <div className="card">
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Recommended Crops</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {result.recommended_crops?.map((crop, i) => (
                  <div key={i} style={{
                    border: '1.5px solid var(--gray-200)', borderRadius: 'var(--radius-md)',
                    padding: 16, background: i === 0 ? 'var(--green-bg)' : 'var(--white)',
                    borderColor: i === 0 ? 'var(--green-light)' : 'var(--gray-200)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <div>
                        {i === 0 && <span className="badge badge-green" style={{ fontSize: 10, marginBottom: 6 }}>Top Pick</span>}
                        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--gray-900)', display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Sprout size={16} color="var(--green-primary)" />
                          {crop.crop}
                        </div>
                        <div style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 2 }}>{crop.variety}</div>
                      </div>
                      <span className={`badge ${DIFFICULTY_COLORS[crop.difficulty] || 'badge-gray'}`}>{crop.difficulty}</span>
                    </div>
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 12, color: 'var(--gray-500)', marginBottom: 4 }}>Suitability Score</div>
                      <ScoreBar score={crop.suitability_score} />
                    </div>
                    <div className="grid-2" style={{ gap: 8 }}>
                      {[
                        { label: 'Expected Yield', value: crop.expected_yield_per_acre },
                        { label: 'Investment/Acre', value: crop.investment_per_acre },
                        { label: 'Water Need', value: crop.water_requirement },
                      ].map(({ label, value }) => (
                        <div key={label} style={{ padding: '8px 10px', background: 'var(--gray-50)', borderRadius: 'var(--radius-sm)' }}>
                          <div style={{ fontSize: 11, color: 'var(--gray-400)', marginBottom: 2 }}>{label}</div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-800)' }}>{value}</div>
                        </div>
                      ))}
                    </div>
                    {crop.notes && (
                      <div style={{ marginTop: 10, fontSize: 12.5, color: 'var(--gray-600)', padding: '8px 12px', background: 'white', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--green-light)' }}>
                        {crop.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Advice */}
            <div className="grid-2" style={{ gap: 16 }}>
              {/* Intercropping */}
              {result.intercropping_suggestions?.length > 0 && (
                <div className="card">
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Intercropping Suggestions</div>
                  {result.intercropping_suggestions.map((s, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--gray-600)', marginBottom: 8, alignItems: 'flex-start' }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green-medium)', marginTop: 6, flexShrink: 0 }} />
                      {s}
                    </div>
                  ))}
                </div>
              )}

              {/* Organic Practices */}
              {result.organic_practices?.length > 0 && (
                <div className="card">
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Organic Practices</div>
                  {result.organic_practices.map((p, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--gray-600)', marginBottom: 8, alignItems: 'flex-start' }}>
                      <Sprout size={13} color="var(--green-medium)" style={{ marginTop: 2, flexShrink: 0 }} />
                      {p}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sowing & Soil Info */}
            <div className="card">
              <div className="grid-2" style={{ gap: 16 }}>
                {[
                  { label: 'Crop Rotation Advice', value: result.crop_rotation_advice },
                  { label: 'Best Sowing Time', value: result.best_sowing_time },
                  { label: 'Seed Quantity Per Acre', value: result.seed_quantity_per_acre },
                  { label: 'Soil Preparation', value: result.soil_preparation },
                ].filter(i => i.value).map(({ label, value }) => (
                  <div key={label}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>{label}</div>
                    <div style={{ fontSize: 13, color: 'var(--gray-700)', lineHeight: 1.55 }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
