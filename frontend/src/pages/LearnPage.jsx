import { useEffect, useState } from 'react'
import { Clock, ChevronRight, X, CheckCircle } from 'lucide-react'
import { learningAPI } from '../utils/api'

const CATEGORY_LABELS = {
  preparations: 'Preparations',
  practices: 'Farming Practices',
  pest_management: 'Pest Management',
  soil: 'Soil Health',
}

const LESSON_ICONS = {
  jeevamrut: '🫙',
  beejamrut: '🌱',
  'ghan-jeevamrut': '🧱',
  'crop-rotation': '🔄',
  'companion-planting': '🌿',
  'multilevel-farming': '🌳',
  'organic-pest-control': '🐛',
  'soil-health': '🌍',
}

const DIFFICULTY_COLORS = {
  Beginner: 'badge-green',
  Intermediate: 'badge-orange',
  Advanced: 'badge-red',
}

function LessonModal({ lesson, onClose }) {
  if (!lesson) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20
    }}>
      <div style={{
        background: 'white', borderRadius: 'var(--radius-lg)',
        maxWidth: 680, width: '100%', maxHeight: '90vh',
        overflow: 'hidden', display: 'flex', flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, var(--green-primary), var(--green-medium))',
          color: 'white', padding: '20px 24px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'
        }}>
          <div>
            <div style={{ fontSize: 24, marginBottom: 4 }}>{LESSON_ICONS[lesson.id] || '🌿'}</div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>{lesson.title}</div>
            <div style={{ fontSize: 13, opacity: 0.85, marginTop: 2 }}>{lesson.subtitle}</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <span className={`badge ${DIFFICULTY_COLORS[lesson.difficulty] || 'badge-gray'}`} style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: 11 }}>
                {lesson.difficulty}
              </span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Clock size={12} /> {lesson.read_time} min read
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: 'y-auto', padding: '20px 24px' }}>
          {/* Key Points */}
          {lesson.key_points?.length > 0 && (
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray-800)', marginBottom: 10 }}>Key Points</div>
              {lesson.key_points.map((p, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--gray-700)', marginBottom: 7, alignItems: 'flex-start' }}>
                  <CheckCircle size={14} color="var(--green-medium)" style={{ marginTop: 2, flexShrink: 0 }} />
                  {p}
                </div>
              ))}
            </div>
          )}

          {/* Ingredients (for preparations) */}
          {lesson.ingredients?.length > 0 && (
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray-800)', marginBottom: 10 }}>Ingredients</div>
              <div style={{ background: 'var(--green-bg)', borderRadius: 'var(--radius-sm)', padding: '12px 16px' }}>
                {lesson.ingredients.map((item, i) => (
                  <div key={i} style={{ fontSize: 13, color: 'var(--gray-700)', padding: '5px 0', borderBottom: i < lesson.ingredients.length - 1 ? '1px solid var(--green-pale)' : 'none' }}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Steps */}
          {lesson.preparation_steps?.length > 0 && (
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray-800)', marginBottom: 10 }}>Preparation Steps</div>
              {lesson.preparation_steps.map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, fontSize: 13, color: 'var(--gray-700)', marginBottom: 9, alignItems: 'flex-start' }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--green-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  {step}
                </div>
              ))}
            </div>
          )}

          {/* Usage */}
          {lesson.usage && (
            <div style={{ marginBottom: 18, padding: '12px 16px', background: '#EFF6FF', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--blue)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--blue)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>How to Use</div>
              <div style={{ fontSize: 13, color: 'var(--gray-700)', lineHeight: 1.6 }}>{lesson.usage}</div>
            </div>
          )}

          {/* Benefits */}
          {lesson.benefits?.length > 0 && (
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray-800)', marginBottom: 10 }}>Benefits</div>
              {lesson.benefits.map((b, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--gray-700)', marginBottom: 7, alignItems: 'flex-start' }}>
                  <CheckCircle size={14} color="var(--green-medium)" style={{ marginTop: 2, flexShrink: 0 }} />
                  {b}
                </div>
              ))}
            </div>
          )}

          {/* Cautions */}
          {lesson.cautions?.length > 0 && (
            <div style={{ padding: '12px 16px', background: 'var(--yellow-light)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--yellow-light)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--yellow)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>Important Cautions</div>
              {lesson.cautions.map((c, i) => (
                <div key={i} style={{ fontSize: 13, color: 'var(--gray-700)', marginBottom: 5, paddingLeft: 12, borderLeft: '2px solid var(--yellow)' }}>
                  {c}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function LearnPage() {
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('all')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    learningAPI.lessons({ category: category === 'all' ? undefined : category })
      .then(r => setLessons(r.data.lessons || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [category])

  const openLesson = async (lesson) => {
    try {
      const r = await learningAPI.getLesson(lesson.id)
      setSelected(r.data.lesson)
    } catch {
      setSelected(lesson)
    }
  }

  const categories = ['all', ...Object.keys(CATEGORY_LABELS)]

  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <div className="page-title">Natural Farming Learning Center</div>
        <div className="page-subtitle">In-depth guides on natural farming techniques, preparations, and practices</div>
      </div>

      {/* Category Filter */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={category === c ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm'}
          >
            {c === 'all' ? 'All Topics' : CATEGORY_LABELS[c] || c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid-4" style={{ gap: 16 }}>
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div className="skeleton" style={{ height: 130 }} />
              <div style={{ padding: 14 }}>
                <div className="skeleton" style={{ height: 16, marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 12, width: '70%' }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid-4" style={{ gap: 16 }}>
          {lessons.map(lesson => (
            <div key={lesson.id} className="lesson-card" onClick={() => openLesson(lesson)}>
              <div className="lesson-img" style={{ height: 130, fontSize: 52, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {LESSON_ICONS[lesson.id] || '🌿'}
              </div>
              <div className="lesson-body">
                <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                  <span className={`badge ${DIFFICULTY_COLORS[lesson.difficulty] || 'badge-gray'}`} style={{ fontSize: 10 }}>
                    {lesson.difficulty}
                  </span>
                </div>
                <div className="lesson-title">{lesson.title}</div>
                <div className="lesson-subtitle">{lesson.subtitle}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                  <div style={{ fontSize: 11, color: 'var(--gray-400)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={11} /> {lesson.read_time} min read
                  </div>
                  <ChevronRight size={14} color="var(--green-primary)" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && <LessonModal lesson={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
