import { useEffect, useState } from 'react'
import { Search, ExternalLink, Phone, ChevronDown, ChevronUp, Building2 } from 'lucide-react'
import { schemesAPI } from '../utils/api'

const CATEGORIES = [
  { key: 'all', label: 'All Schemes' },
  { key: 'income_support', label: 'Income Support' },
  { key: 'organic_farming', label: 'Organic Farming' },
  { key: 'natural_farming', label: 'Natural Farming' },
  { key: 'soil', label: 'Soil Health' },
  { key: 'insurance', label: 'Crop Insurance' },
  { key: 'credit', label: 'Credit & Loans' },
]

function SchemeCard({ scheme }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="scheme-card" onClick={() => setExpanded(e => !e)}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: 'var(--green-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Building2 size={18} color="var(--green-primary)" />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--gray-900)' }}>{scheme.name}</div>
              <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{scheme.full_name}</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
            <span className="scheme-badge">{scheme.category?.replace(/_/g, ' ')}</span>
            <span className="badge badge-green" style={{ fontSize: 11 }}>{scheme.status === 'active' ? 'Active' : 'Check Status'}</span>
          </div>

          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--green-primary)', marginBottom: 6 }}>
            Benefit: {scheme.benefit_amount}
          </div>
          <div style={{ fontSize: 13, color: 'var(--gray-600)', lineHeight: 1.55 }}>
            {scheme.description}
          </div>
        </div>

        <div style={{ color: 'var(--gray-400)', flexShrink: 0, marginTop: 4 }}>
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>

      {expanded && (
        <div onClick={e => e.stopPropagation()} style={{ marginTop: 16, borderTop: '1px solid var(--gray-100)', paddingTop: 16 }}>
          <div className="grid-2" style={{ gap: 16, marginBottom: 16 }}>
            {/* Eligibility */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>Eligibility</div>
              {scheme.eligibility?.map((e, i) => (
                <div key={i} style={{ display: 'flex', gap: 6, fontSize: 13, color: 'var(--gray-600)', marginBottom: 5, alignItems: 'flex-start' }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--green-medium)', marginTop: 6, flexShrink: 0 }} />
                  {e}
                </div>
              ))}
            </div>

            {/* Documents */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>Required Documents</div>
              {scheme.documents?.map((d, i) => (
                <div key={i} style={{ display: 'flex', gap: 6, fontSize: 13, color: 'var(--gray-600)', marginBottom: 5, alignItems: 'flex-start' }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--blue)', marginTop: 6, flexShrink: 0 }} />
                  {d}
                </div>
              ))}
            </div>
          </div>

          {/* Application Process */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>How to Apply</div>
            {scheme.application_process?.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, fontSize: 13, color: 'var(--gray-600)', marginBottom: 8, alignItems: 'flex-start' }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--green-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 11, fontWeight: 700, color: 'var(--green-primary)' }}>
                  {i + 1}
                </div>
                {step}
              </div>
            ))}
          </div>

          {/* Links */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {scheme.official_link && (
              <a
                href={scheme.official_link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm"
                style={{ textDecoration: 'none' }}
              >
                <ExternalLink size={13} /> Official Website
              </a>
            )}
            {scheme.helpline && (
              <a
                href={`tel:${scheme.helpline.split(' ')[0]}`}
                className="btn btn-secondary btn-sm"
                style={{ textDecoration: 'none' }}
              >
                <Phone size={13} /> Helpline: {scheme.helpline}
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function SchemesPage() {
  const [schemes, setSchemes] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')

  useEffect(() => {
    schemesAPI.list({ category: category === 'all' ? undefined : category, search: search || undefined })
      .then(r => setSchemes(r.data.schemes || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [category, search])

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <div className="page-title">Government Schemes</div>
        <div className="page-subtitle">Find financial support, subsidies, and programs for natural farming</div>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 16 }}>
        <Search size={16} color="var(--gray-400)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
        <input
          className="form-input"
          style={{ paddingLeft: 40 }}
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search schemes... e.g. PM-KISAN, organic, loan"
        />
      </div>

      {/* Category Filters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {CATEGORIES.map(c => (
          <button
            key={c.key}
            onClick={() => setCategory(c.key)}
            className={category === c.key ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm'}
          >
            {c.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <span className="loading-spinner" style={{ width: 32, height: 32 }} />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {schemes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 60, color: 'var(--gray-500)' }}>
              No schemes found matching your search.
            </div>
          ) : (
            schemes.map(s => <SchemeCard key={s.id} scheme={s} />)
          )}
        </div>
      )}

      {/* Disclaimer */}
      <div style={{ marginTop: 24, padding: '12px 16px', background: 'var(--yellow-light)', borderRadius: 'var(--radius-sm)', fontSize: 12, color: 'var(--gray-600)', lineHeight: 1.6 }}>
        Note: Scheme details are for reference purposes. Always verify current eligibility, amounts, and deadlines from official government websites or your nearest agriculture office before applying.
      </div>
    </div>
  )
}
