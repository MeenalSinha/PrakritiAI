import { useEffect, useState } from 'react'
import { MessageCircle, Star, Trash2, Clock, User, Globe, Bell, ChevronRight } from 'lucide-react'
import { chatAPI } from '../utils/api'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export function HistoryPage() {
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) { setLoading(false); return }
    chatAPI.getConversations()
      .then(r => setConversations(r.data.conversations || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user])

  const toggleFavorite = async (sessionId, e) => {
    e.stopPropagation()
    try {
      const r = await chatAPI.toggleFavorite(sessionId)
      setConversations(prev => prev.map(c =>
        c.session_id === sessionId ? { ...c, is_favorite: r.data.is_favorite } : c
      ))
    } catch { toast.error('Could not update favorite.') }
  }

  const deleteConv = async (sessionId, e) => {
    e.stopPropagation()
    if (!window.confirm('Delete this conversation?')) return
    try {
      await chatAPI.deleteConversation(sessionId)
      setConversations(prev => prev.filter(c => c.session_id !== sessionId))
      toast.success('Conversation deleted')
    } catch { toast.error('Could not delete.') }
  }

  if (!user) {
    return (
      <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', paddingTop: 60 }}>
        <MessageCircle size={48} color="var(--gray-300)" style={{ margin: '0 auto 16px' }} />
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Sign in to view history</div>
        <div style={{ color: 'var(--gray-500)', marginBottom: 20 }}>Your conversation history is saved when you are signed in.</div>
        <button onClick={() => navigate('/login')} className="btn btn-primary">Sign In</button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <div className="page-title">Chat History</div>
        <div className="page-subtitle">Your previous conversations with PrakritiAI</div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <span className="loading-spinner" style={{ width: 32, height: 32 }} />
        </div>
      ) : conversations.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <MessageCircle size={48} color="var(--gray-300)" style={{ margin: '0 auto 16px' }} />
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--gray-500)' }}>No conversations yet</div>
          <div style={{ color: 'var(--gray-400)', marginTop: 6 }}>Start chatting with PrakritiAI to see your history here.</div>
          <button onClick={() => navigate('/assistant')} className="btn btn-primary" style={{ marginTop: 20 }}>
            Start Conversation
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {conversations.map(conv => (
            <div
              key={conv.id}
              onClick={() => navigate('/assistant', { state: { sessionId: conv.session_id } })}
              style={{
                padding: '14px 18px',
                background: 'white',
                border: '1px solid var(--gray-200)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                transition: 'all 0.15s'
              }}
            >
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: conv.is_voice ? '#FFF0F0' : 'var(--green-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MessageCircle size={18} color={conv.is_voice ? 'var(--red)' : 'var(--green-primary)'} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-800)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {conv.title || 'Untitled Conversation'}
                </div>
                <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Clock size={11} />
                  {new Date(conv.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  {conv.is_voice && <span className="badge badge-red" style={{ fontSize: 10 }}>Voice</span>}
                  <span className="badge badge-gray" style={{ fontSize: 10 }}>{conv.language?.toUpperCase()}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  onClick={e => toggleFavorite(conv.session_id, e)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
                >
                  <Star size={16} color={conv.is_favorite ? '#F59E0B' : 'var(--gray-300)'} fill={conv.is_favorite ? '#F59E0B' : 'none'} />
                </button>
                <button
                  onClick={e => deleteConv(conv.session_id, e)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
                >
                  <Trash2 size={15} color="var(--gray-300)" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Settings Page ──────────────────────────────────────

export function SettingsPage() {
  const { user, logout, language, changeLanguage } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState(user?.name || '')
  const [state, setState] = useState(user?.state || '')

  if (!user) {
    return (
      <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', paddingTop: 60 }}>
        <User size={48} color="var(--gray-300)" style={{ margin: '0 auto 16px' }} />
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Sign in to manage settings</div>
        <button onClick={() => navigate('/login')} className="btn btn-primary" style={{ marginTop: 12 }}>Sign In</button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <div className="page-title">Settings</div>
        <div className="page-subtitle">Manage your profile and preferences</div>
      </div>

      {/* Profile Card */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--green-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700 }}>
            {user.name?.[0]?.toUpperCase() || 'K'}
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{user.name}</div>
            <div style={{ fontSize: 13, color: 'var(--gray-500)' }}>{user.phone || 'Guest User'}</div>
            <div style={{ fontSize: 13, color: 'var(--gray-500)' }}>{user.state || 'Location not set'}</div>
          </div>
        </div>

        <div className="divider" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="form-group">
            <label className="form-label">Display Name</label>
            <input className="form-input" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">State</label>
            <input className="form-input" value={state} onChange={e => setState(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Preferred Language</label>
            <select className="form-select" value={language} onChange={e => changeLanguage(e.target.value)}>
              <option value="hi">Hindi</option>
              <option value="en">English</option>
              <option value="hinglish">Hinglish</option>
            </select>
          </div>
        </div>
      </div>

      {/* App Info */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>About PrakritiAI</div>
        {[
          { label: 'Version', value: '1.0.0' },
          { label: 'Built for', value: 'Connecting Dreams Foundation' },
          { label: 'AI Model', value: 'Claude / GPT-4 with RAG' },
          { label: 'Knowledge Base', value: 'Natural Farming, ICAR, KVK Guides' },
        ].map(({ label, value }) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid var(--gray-100)', fontSize: 13 }}>
            <span style={{ color: 'var(--gray-500)' }}>{label}</span>
            <span style={{ fontWeight: 500, color: 'var(--gray-800)' }}>{value}</span>
          </div>
        ))}
      </div>

      <button onClick={logout} className="btn btn-ghost" style={{ width: '100%', color: 'var(--red)', marginTop: 4 }}>
        Sign Out
      </button>
    </div>
  )
}
