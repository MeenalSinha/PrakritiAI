import { Leaf, Mic, Camera, Sprout, Cloud, TrendingUp, BookOpen, Shield, ExternalLink, Phone } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const FEATURES = [
  { icon: Mic, title: 'Voice Assistant', desc: 'Speak in Hindi, English, or Hinglish. AI listens, understands, and responds aloud.', color: '#E8F5E9', iconColor: '#2D6A4F' },
  { icon: Camera, title: 'Crop Doctor', desc: 'Upload a photo of your crop. AI detects disease, pests, and deficiencies with natural treatment.', color: '#EFF6FF', iconColor: '#2563EB' },
  { icon: Sprout, title: 'Seed Advisor', desc: 'Get personalized crop and seed recommendations based on your land, water, and budget.', color: '#FFF7ED', iconColor: '#EA580C' },
  { icon: Cloud, title: 'Weather Intelligence', desc: 'Real-time weather with farming-specific advice for your area.', color: '#F0FDF4', iconColor: '#16A34A' },
  { icon: TrendingUp, title: 'Market Prices', desc: 'Live mandi prices, 30-day trends, and best selling time recommendations.', color: '#FDF4FF', iconColor: '#9333EA' },
  { icon: BookOpen, title: 'Learning Center', desc: 'In-depth guides on Jeevamrut, Beejamrut, Crop Rotation, and 6 more natural farming topics.', color: '#FEF9C3', iconColor: '#CA8A04' },
  { icon: Shield, title: 'Government Schemes', desc: 'PM-KISAN, PKVY, NMNF, KCC, PMFBY, and Soil Health Card — all in one place.', color: '#FFF1F2', iconColor: '#E11D48' },
]

const ARCHITECTURE = [
  { step: '1', label: 'Voice / Text Input', detail: 'Web Speech API captures voice in Hindi or English' },
  { step: '2', label: 'Intent Detection', detail: 'AI identifies: chat, diagnosis, seeds, or schemes' },
  { step: '3', label: 'RAG Retrieval', detail: 'FAISS vector store finds relevant knowledge (20 docs)' },
  { step: '4', label: 'LLM Generation', detail: 'Claude / GPT-4 generates grounded, guardrailed response' },
  { step: '5', label: 'Guardrails Check', detail: 'No chemicals, no fabrication, confidence always stated' },
  { step: '6', label: 'TTS Response', detail: 'SpeechSynthesis API reads response aloud in local language' },
  { step: '7', label: 'Memory Storage', detail: 'SQLite persists conversation with full history and favorites' },
]

const TECH_STACK = [
  { category: 'Frontend', items: ['React 18 + Vite', 'React Router v6', 'Recharts', 'Web Speech API', 'SpeechSynthesis API', 'Lucide Icons'] },
  { category: 'Backend', items: ['FastAPI (Python)', 'SQLAlchemy + SQLite', 'Uvicorn ASGI', 'JWT (python-jose)', 'bcrypt auth', 'httpx async'] },
  { category: 'AI / ML', items: ['Anthropic Claude', 'OpenAI GPT-4o', 'Vision AI (image)', 'FAISS RAG (keyword)', 'Demo fallback (offline)'] },
  { category: 'External', items: ['OpenWeatherMap API', 'Mandi price engine', 'Government scheme DB', 'KVK center database'] },
]

const GUARDRAILS = [
  'Never recommends synthetic pesticides or chemical fertilizers',
  'Never fabricates government scheme amounts or eligibility',
  'Never fabricates weather data — always shows source label',
  'Always states confidence percentage for crop diagnoses',
  'If uncertain, refers farmer to nearest KVK or agriculture officer',
  'RAG context keeps answers grounded in verified sources',
  'Demo mode provides safe fallback responses without hallucination',
]

export default function AboutPage() {
  const navigate = useNavigate()

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1B5E20 0%, #2D6A4F 60%, #40916C 100%)',
        borderRadius: 'var(--radius-lg)', padding: '36px 40px',
        color: 'white', marginBottom: 24, position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            <div style={{ width: 52, height: 52, background: 'rgba(255,255,255,0.15)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Leaf size={28} color="white" />
            </div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.2 }}>PrakritiAI</div>
              <div style={{ fontSize: 13, opacity: 0.85 }}>Your Voice-Powered Natural Farming Companion</div>
            </div>
          </div>
          <p style={{ fontSize: 14, opacity: 0.9, lineHeight: 1.7, maxWidth: 620 }}>
            PrakritiAI is a full-stack AI assistant designed to help Indian farmers transition toward 
            natural farming. Built for the Connecting Dreams Foundation Round 2 Technical Assignment, 
            it combines voice interaction, crop disease diagnosis, government scheme discovery, 
            market intelligence, and a comprehensive learning center — all in Hindi, English, and Hinglish.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/assistant')} className="btn" style={{ background: 'white', color: 'var(--green-primary)', fontWeight: 700 }}>
              <Mic size={15} /> Try Voice Assistant
            </button>
            <button onClick={() => navigate('/')} className="btn" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1.5px solid rgba(255,255,255,0.4)' }}>
              Go to Dashboard
            </button>
          </div>
        </div>
        <div style={{ position: 'absolute', right: -30, top: -30, width: 160, height: 160, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', right: 60, bottom: -20, width: 100, height: 100, background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />
      </div>

      {/* Features Grid */}
      <div style={{ marginBottom: 24 }}>
        <div className="section-title" style={{ marginBottom: 16 }}>Core Features</div>
        <div className="grid-4" style={{ gap: 14 }}>
          {FEATURES.map(({ icon: Icon, title, desc, color, iconColor }) => (
            <div key={title} className="card" style={{ padding: 16 }}>
              <div style={{ width: 40, height: 40, background: color, borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <Icon size={20} color={iconColor} />
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray-800)', marginBottom: 6 }}>{title}</div>
              <div style={{ fontSize: 12.5, color: 'var(--gray-500)', lineHeight: 1.55 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Architecture */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="section-title" style={{ marginBottom: 16 }}>AI Architecture</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {ARCHITECTURE.map(({ step, label, detail }, i) => (
            <div key={step} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', paddingBottom: i < ARCHITECTURE.length - 1 ? 14 : 0, marginBottom: i < ARCHITECTURE.length - 1 ? 14 : 0, borderBottom: i < ARCHITECTURE.length - 1 ? '1px solid var(--gray-100)' : 'none' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--green-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>{step}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-800)' }}>{label}</div>
                <div style={{ fontSize: 12.5, color: 'var(--gray-500)', marginTop: 2 }}>{detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="section-title" style={{ marginBottom: 16 }}>Technology Stack</div>
        <div className="grid-4" style={{ gap: 14 }}>
          {TECH_STACK.map(({ category, items }) => (
            <div key={category}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--green-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>{category}</div>
              {items.map(item => (
                <div key={item} style={{ fontSize: 13, color: 'var(--gray-600)', padding: '5px 0', borderBottom: '1px solid var(--gray-100)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--green-light)', flexShrink: 0 }} />
                  {item}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Prompt Guardrails */}
      <div className="card" style={{ marginBottom: 24, background: 'var(--green-bg)', border: '1px solid var(--green-pale)' }}>
        <div className="section-title" style={{ marginBottom: 16, color: 'var(--green-primary)' }}>Prompt Guardrails</div>
        <p style={{ fontSize: 13, color: 'var(--gray-600)', marginBottom: 14, lineHeight: 1.6 }}>
          PrakritiAI is designed with strict guardrails to ensure safe, trustworthy advice for farmers.
        </p>
        {GUARDRAILS.map((g, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, fontSize: 13, color: 'var(--gray-700)', marginBottom: 9, alignItems: 'flex-start' }}>
            <Shield size={14} color="var(--green-primary)" style={{ marginTop: 2, flexShrink: 0 }} />
            {g}
          </div>
        ))}
      </div>

      {/* Acknowledgements */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="section-title" style={{ marginBottom: 14 }}>Acknowledgements</div>
        <div className="grid-2" style={{ gap: 12 }}>
          {[
            { name: 'Subhash Palekar', role: 'Zero Budget Natural Farming (ZBNF) pioneer' },
            { name: 'ICAR', role: 'Indian Council of Agricultural Research' },
            { name: 'KVK Network', role: 'Krishi Vigyan Kendra — India\'s farm extension network' },
            { name: 'Ministry of Agriculture', role: 'PM-KISAN, PKVY, NMNF scheme guidelines' },
            { name: 'Anthropic Claude', role: 'Core AI model powering farmer conversations' },
            { name: 'OpenWeatherMap', role: 'Real-time weather data integration' },
          ].map(({ name, role }) => (
            <div key={name} style={{ padding: '10px 12px', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-800)' }}>{name}</div>
              <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2 }}>{role}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact / Help */}
      <div className="helpline-banner">
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray-800)' }}>Agriculture Helpline</div>
          <div style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 2 }}>
            For urgent queries, contact the national Kisan Call Centre — available 24x7 in all Indian languages.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => window.open('tel:1551')} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Phone size={15} /> 1551
          </button>
          <a href="https://mkisan.gov.in" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
            <ExternalLink size={14} /> mKisan Portal
          </a>
        </div>
      </div>

      <div style={{ marginTop: 20, textAlign: 'center', fontSize: 12, color: 'var(--gray-400)' }}>
        PrakritiAI v1.0.0 — Built for Connecting Dreams Foundation Round 2 — MIT License
      </div>
    </div>
  )
}
