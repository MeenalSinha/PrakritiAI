import { useState } from 'react'
import { Calendar, BookOpen, ChevronRight } from 'lucide-react'

// ─── Organic Farming Calendar ────────────────────────────────────────────────

const CALENDAR_DATA = [
  {
    month: 'January', season: 'Rabi',
    activities: ['Irrigate wheat at grain filling stage', 'Apply Jeevamrut to mustard', 'Harvest chickpea in late January', 'Prepare Ghan Jeevamrut for Kharif'],
    tip: 'Check for aphid attack on mustard — spray neem oil if found'
  },
  {
    month: 'February', season: 'Rabi',
    activities: ['Harvest wheat (late February onward)', 'Prepare farm for Zaid crops', 'Apply vermicompost to fruit orchards', 'Seed treatment with Beejamrut for summer crops'],
    tip: 'Do not burn wheat residue — incorporate it for organic matter'
  },
  {
    month: 'March', season: 'Zaid',
    activities: ['Sow summer vegetables (cucumber, gourd)', 'Prepare Jeevamrut for standing crops', 'Deep ploughing for Kharif preparation', 'Apply Dashaparni Ark preventively'],
    tip: 'Install yellow sticky traps to monitor flying insects'
  },
  {
    month: 'April', season: 'Zaid',
    activities: ['Irrigate summer crops every 4-5 days', 'Harvest Rabi pulses', 'Spray neem oil for heat-season pests', 'Soil health check and pH testing'],
    tip: 'Mulch around summer crops to retain moisture in heat'
  },
  {
    month: 'May', season: 'Pre-Kharif',
    activities: ['Deep ploughing in hot sun (kills pests)', 'Prepare Beejamrut for Kharif seeds', 'Build farm ponds before monsoon', 'Source desi cow dung for Jeevamrut'],
    tip: 'This is the best month to build compost pits for monsoon use'
  },
  {
    month: 'June', season: 'Kharif',
    activities: ['Sow Kharif crops after first 75mm rain', 'Treat seeds with Beejamrut 48 hrs before sowing', 'Apply Ghan Jeevamrut at field preparation', 'Set up pheromone traps'],
    tip: 'Never sow in dry soil — wait for adequate moisture from rain'
  },
  {
    month: 'July', season: 'Kharif',
    activities: ['Apply liquid Jeevamrut every 15 days', 'Monitor for stem borer, leaf folder', 'Spray Dashaparni Ark preventively', 'Inter-culture to control weeds'],
    tip: 'Do not spray during heavy rain — wait for clear weather'
  },
  {
    month: 'August', season: 'Kharif',
    activities: ['Critical stage for paddy, soybean, cotton', 'Apply Jeevamrut at flowering', 'Monitor blast in paddy with neem spray', 'Install light traps for moths'],
    tip: 'High humidity — watch for fungal disease, spray cow urine solution'
  },
  {
    month: 'September', season: 'Kharif',
    activities: ['Harvest early Kharif crops (moong, urad)', 'Prepare land for Rabi planting', 'Collect and dry seeds for next season', 'Apply Trichoderma for soil health'],
    tip: 'Save seeds from healthiest plants for Beejamrut treatment next season'
  },
  {
    month: 'October', season: 'Rabi',
    activities: ['Sow mustard (first 2 weeks)', 'Prepare for wheat sowing (November)', 'Apply FYM / Ghan Jeevamrut to fields', 'Deep plough Kharif stubble fields'],
    tip: 'Ideal time to check and repair irrigation channels before Rabi'
  },
  {
    month: 'November', season: 'Rabi',
    activities: ['Sow wheat (Nov 1-25 for best yield)', 'Treat wheat seeds with Beejamrut', 'Apply Jeevamrut at crown root initiation', 'Sow chickpea and lentils'],
    tip: 'Do not delay wheat sowing beyond Nov 25 — yield loss is significant'
  },
  {
    month: 'December', season: 'Rabi',
    activities: ['First irrigation of wheat at 20-25 days', 'Protect crops from frost in North India', 'Apply Jeevamrut to mustard at flowering', 'Harvest early winter vegetables'],
    tip: 'Smoke smudging or mulching can protect crops from frost damage'
  },
]

const SEASON_COLORS = {
  Rabi: { bg: '#EFF6FF', text: '#2563EB' },
  Kharif: { bg: '#F0FDF4', text: '#16A34A' },
  Zaid: { bg: '#FFF7ED', text: '#EA580C' },
  'Pre-Kharif': { bg: '#FDF4FF', text: '#9333EA' },
}

export function FarmingCalendar() {
  const [activeMonth, setActiveMonth] = useState(null)
  const currentMonth = new Date().toLocaleString('en', { month: 'long' })

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <div className="page-title">Organic Farming Calendar</div>
        <div className="page-subtitle">Month-by-month natural farming activities and tips for the full year</div>
      </div>

      <div className="grid-4" style={{ gap: 12 }}>
        {CALENDAR_DATA.map(item => {
          const colors = SEASON_COLORS[item.season] || SEASON_COLORS.Kharif
          const isCurrent = item.month === currentMonth
          const isOpen = activeMonth === item.month
          return (
            <div
              key={item.month}
              onClick={() => setActiveMonth(isOpen ? null : item.month)}
              className="card card-hover"
              style={{
                padding: 16, cursor: 'pointer',
                border: isCurrent ? '2px solid var(--green-medium)' : '1px solid var(--gray-200)',
                background: isOpen ? 'var(--green-bg)' : 'white'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--gray-900)' }}>
                  {item.month}
                  {isCurrent && <span className="badge badge-green" style={{ fontSize: 10, marginLeft: 6 }}>Now</span>}
                </div>
                <span style={{ padding: '2px 8px', background: colors.bg, color: colors.text, borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 600 }}>
                  {item.season}
                </span>
              </div>

              {!isOpen ? (
                <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{item.activities.length} activities</div>
              ) : (
                <div>
                  {item.activities.map((act, i) => (
                    <div key={i} style={{ display: 'flex', gap: 6, fontSize: 12.5, color: 'var(--gray-700)', marginBottom: 6, alignItems: 'flex-start' }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--green-medium)', marginTop: 5, flexShrink: 0 }} />
                      {act}
                    </div>
                  ))}
                  <div style={{ marginTop: 10, padding: '8px 10px', background: 'var(--yellow-light)', borderRadius: 'var(--radius-sm)', fontSize: 12, color: 'var(--gray-700)', borderLeft: '3px solid var(--yellow)' }}>
                    {item.tip}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}


// ─── Farming Glossary ────────────────────────────────────────────────────────

const GLOSSARY_TERMS = [
  { term: 'Beejamrut', hi: 'बीजामृत', def: 'Seed treatment liquid made from cow dung, urine, and lime to protect seeds from soil-borne diseases and improve germination.' },
  { term: 'Jeevamrut', hi: 'जीवामृत', def: 'Liquid biofertilizer made from desi cow dung, urine, jaggery, gram flour, and soil. Activates soil microorganisms and improves fertility.' },
  { term: 'Ghan Jeevamrut', hi: 'घन जीवामृत', def: 'Solid form of Jeevamrut with 6-month shelf life. Applied at 100-200 kg per acre as basal dressing before sowing.' },
  { term: 'Dashaparni Ark', hi: 'दशपर्णी अर्क', def: 'Organic pesticide fermented from 10 types of leaves including neem, papaya, and guava. Repels 80% of common farm pests.' },
  { term: 'ZBNF', hi: 'ZBNF', def: 'Zero Budget Natural Farming — farming system developed by Subhash Palekar based on desi cow byproducts, eliminating need for external inputs.' },
  { term: 'PGS Certification', hi: 'PGS प्रमाणीकरण', def: 'Participatory Guarantee System — farmer-managed organic certification that is free to obtain through pgsindia-ncof.gov.in.' },
  { term: 'Kharif', hi: 'खरीफ', def: 'Monsoon season crops sown in June-July and harvested October-November. Examples: paddy, soybean, cotton, maize, moong.' },
  { term: 'Rabi', hi: 'रबी', def: 'Winter season crops sown October-November, harvested March-April. Examples: wheat, mustard, chickpea, peas, barley.' },
  { term: 'Zaid', hi: 'जायद', def: 'Short summer season between Rabi and Kharif (March-June). Examples: cucumber, watermelon, moong, groundnut.' },
  { term: 'MSP', hi: 'MSP', def: 'Minimum Support Price — government-guaranteed floor price for crops to protect farmers from market price crashes.' },
  { term: 'KVK', hi: 'KVK', def: 'Krishi Vigyan Kendra — government farm science centers providing free training, demos, and technical advice to farmers.' },
  { term: 'Mandi', hi: 'मंडी', def: 'Regulated wholesale market where farmers sell crops. Mandi prices are updated daily on the eNAM portal.' },
  { term: 'Vermicompost', hi: 'केंचुआ खाद', def: 'Earthworm-processed organic compost made from kitchen waste and crop residue. Richer in nutrients than regular compost.' },
  { term: 'Mulching', hi: 'मल्चिंग', def: 'Covering soil surface with dry leaves or crop residue to retain moisture, suppress weeds, and improve organic matter.' },
  { term: 'Intercropping', hi: 'सहफसल', def: 'Growing two or more crops simultaneously in the same field to maximize land use, reduce pests, and improve income.' },
  { term: 'Green Manuring', hi: 'हरी खाद', def: 'Growing and incorporating fast-growing legume crops like Dhaincha or Sunhemp into soil to add nitrogen and organic matter.' },
]

export function Glossary() {
  const [search, setSearch] = useState('')
  const filtered = GLOSSARY_TERMS.filter(t =>
    t.term.toLowerCase().includes(search.toLowerCase()) ||
    t.def.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <div className="page-title">Farming Glossary</div>
        <div className="page-subtitle">Natural farming and agriculture terms explained in simple language</div>
      </div>

      <input
        className="form-input"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search terms... e.g. Jeevamrut, MSP, KVK"
        style={{ marginBottom: 16 }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(({ term, hi, def }) => (
          <div key={term} className="card" style={{ padding: '14px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--green-primary)' }}>{term}</div>
              {hi !== term && (
                <div style={{ fontSize: 14, color: 'var(--gray-500)', fontWeight: 500 }}>{hi}</div>
              )}
            </div>
            <div style={{ fontSize: 13.5, color: 'var(--gray-700)', lineHeight: 1.6 }}>{def}</div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--gray-500)' }}>
            No terms found matching your search.
          </div>
        )}
      </div>
    </div>
  )
}
