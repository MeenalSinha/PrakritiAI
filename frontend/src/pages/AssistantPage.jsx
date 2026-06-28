import { useState, useEffect, useRef, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { Mic, MicOff, Send, Volume2, VolumeX, Trash2, AlertTriangle, BookOpen } from 'lucide-react'
import { chatAPI } from '../utils/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const QUICK_REPLIES = [
  { text: 'Jeevamrut kaise banayein?', icon: '🌿' },
  { text: 'July mein kaun si fasal lagayen?', icon: '🌾' },
  { text: 'Tamatar ke patte peele kyon hain?', icon: '🍂' },
  { text: 'PKVY scheme ke baare mein bataayein', icon: '📋' },
  { text: 'Jaivik keetnashak kaise banayein?', icon: '🐛' },
  { text: 'Mitti ka swasthya kaise sudhaarein?', icon: '🌍' },
]

// Check if browser supports speech recognition
const SPEECH_SUPPORTED = typeof window !== 'undefined' &&
  ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)

// Sentence-boundary TTS splitting
function speakText(text, lang) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  // Split by punctuation for natural pauses
  const sentences = text.match(/[^.!?।\n]+[.!?।\n]*/g) || [text]
  sentences.forEach((sentence, i) => {
    const utterance = new SpeechSynthesisUtterance(sentence.trim())
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN'
    utterance.rate = 0.88
    utterance.pitch = 1.05
    window.speechSynthesis.speak(utterance)
  })
}

function MessageBubble({ msg, onSpeak, ttsEnabled, language }) {
  const isUser = msg.role === 'user'
  return (
    <div
      className={`message-wrapper ${isUser ? 'user' : ''}`}
      role="article"
      aria-label={isUser ? 'Your message' : 'PrakritiAI response'}
    >
      <div className={`message-avatar ${isUser ? 'user-av' : 'ai'}`} aria-hidden="true">
        {isUser ? (msg.userInitial || 'K') : '🌿'}
      </div>
      <div className={`message-bubble ${isUser ? 'user' : 'ai'}`}>
        {msg.content.split('\n').map((line, i) => (
          <span key={i}>{line}{i < msg.content.split('\n').length - 1 && <br />}</span>
        ))}

        {/* RAG Source Citations */}
        {msg.sources?.length > 0 && (
          <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            <div style={{ fontSize: 11, color: 'var(--gray-400)', width: '100%', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
              <BookOpen size={11} /> Sources:
            </div>
            {msg.sources.map((s, i) => (
              <span key={i} className="rag-citation">📄 {s}</span>
            ))}
          </div>
        )}

        {/* Speak button for AI messages */}
        {!isUser && ttsEnabled && (
          <button
            onClick={() => onSpeak(msg.content)}
            style={{
              marginTop: 8, background: 'none', border: 'none',
              color: 'var(--gray-400)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 4,
              fontSize: 11, fontFamily: 'var(--font-sans)', padding: 0
            }}
            aria-label="Read this message aloud"
          >
            <Volume2 size={12} /> Suno
          </button>
        )}
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="message-wrapper" aria-live="polite" aria-label="PrakritiAI is thinking">
      <div className="message-avatar ai" aria-hidden="true">🌿</div>
      <div className="message-bubble ai" style={{ padding: '14px 18px' }}>
        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 7, height: 7, borderRadius: '50%',
              background: 'var(--green-medium)',
              animation: 'wave 1s ease-in-out infinite',
              animationDelay: `${i * 0.15}s`
            }} />
          ))}
          <span style={{ marginLeft: 6, fontSize: 12, color: 'var(--gray-400)' }}>Soch raha hoon...</span>
        </div>
      </div>
    </div>
  )
}

function Waveform() {
  return (
    <div className="waveform" aria-hidden="true">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="waveform-bar" />
      ))}
    </div>
  )
}

export default function AssistantPage() {
  const { user, language } = useAuth()
  const location = useLocation()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sessionId] = useState(() => Math.random().toString(36).slice(2))
  const [loading, setLoading] = useState(false)
  const [recording, setRecording] = useState(false)
  const [ttsEnabled, setTtsEnabled] = useState(true)
  const [transcript, setTranscript] = useState('')
  const [showBrowserWarning, setShowBrowserWarning] = useState(!SPEECH_SUPPORTED)
  const messagesEndRef = useRef(null)
  const recognitionRef = useRef(null)
  const inputRef = useRef(null)

  // Initial message
  useEffect(() => {
    const initMsg = location.state?.initialMessage
    const welcome = language === 'hi'
      ? 'Namaste! Main PrakritiAI hoon — aapka Prakritik Kheti Saathi. 🌿\n\nFasal ki bimari, Jeevamrut banana, mausam, sarkari yojana — kuch bhi poochein. Mic button se Hindi mein baat kar sakte hain!'
      : 'Namaste! I am PrakritiAI, your Natural Farming Companion. 🌿\n\nAsk me anything about crop disease, Jeevamrut preparation, government schemes, or market prices. Press the mic button to speak in Hindi or English!'
    if (initMsg) {
      setMessages([{ role: 'assistant', content: welcome, sources: [] }])
      setTimeout(() => sendMessage(initMsg), 100)
    } else {
      setMessages([{ role: 'assistant', content: welcome, sources: [] }])
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = useCallback(async (text) => {
    const msgText = text || input
    if (!msgText?.trim()) return
    const userMsg = { role: 'user', content: msgText, sources: [], userInitial: user?.name?.[0]?.toUpperCase() || 'K' }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setTranscript('')
    setLoading(true)

    // Append empty assistant message for streaming
    setMessages(prev => [...prev, { role: 'assistant', content: '', sources: [], streaming: true }])

    try {
      const response = await fetch('/api/v1/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msgText,
          session_id: sessionId,
          language,
          is_voice: recording
        }),
      })

      if (!response.ok) {
        if (response.status === 429) throw new Error('429')
        if (response.status === 401) {
            toast.error('Session expired. Please login again.')
            return
        }
        throw new Error('Server error')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let assistantText = ''
      let sources = []
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n\n')
        
        buffer = lines.pop() || ''
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6).trim()
            if (dataStr === '[DONE]') continue
            
            try {
              const payload = JSON.parse(dataStr)
              if (payload.type === 'sources') {
                sources = payload.data
                setMessages(prev => {
                  const newMsgs = [...prev]
                  newMsgs[newMsgs.length - 1] = { ...newMsgs[newMsgs.length - 1], sources }
                  return newMsgs
                })
              } else if (payload.type === 'content') {
                assistantText += payload.data
                setMessages(prev => {
                  const newMsgs = [...prev]
                  newMsgs[newMsgs.length - 1] = { ...newMsgs[newMsgs.length - 1], content: assistantText }
                  return newMsgs
                })
              }
            } catch (e) {
              console.error('Error parsing SSE data', e)
            }
          }
        }
      }
      
      setMessages(prev => {
        const newMsgs = [...prev]
        newMsgs[newMsgs.length - 1] = { ...newMsgs[newMsgs.length - 1], streaming: false }
        return newMsgs
      })

      if (ttsEnabled && 'speechSynthesis' in window) {
        speakText(assistantText, language)
      }
    } catch (e) {
      const errMsg = e.message === '429'
        ? 'Bahut zyada sawal! Thodi der baad try karein.'
        : 'Jawab nahi aaya. Internet check karein aur dobara try karein.'
      toast.error(errMsg)
      setMessages(prev => {
          const lastMsg = prev[prev.length - 1]
          if (lastMsg && lastMsg.role === 'assistant' && !lastMsg.content) {
              return prev.slice(0, -1)
          }
          return prev
      })
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [input, sessionId, language, recording, ttsEnabled, user])

  const startRecording = useCallback(() => {
    if (!SPEECH_SUPPORTED) {
      setShowBrowserWarning(true)
      toast.error('Aapka browser voice input support nahi karta. Chrome use karein.')
      return
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = language === 'hi' ? 'hi-IN' : language === 'en' ? 'en-IN' : 'hi-IN'
    recognition.continuous = false
    recognition.interimResults = true
    recognition.maxAlternatives = 1

    recognition.onstart = () => setRecording(true)
    recognition.onresult = (e) => {
      const t = Array.from(e.results).map(r => r[0].transcript).join('')
      setTranscript(t)
      if (e.results[e.results.length - 1].isFinal) {
        setRecording(false)
        sendMessage(t)
      }
    }
    recognition.onerror = (e) => {
      setRecording(false)
      if (e.error !== 'aborted') {
        toast.error('Aawaz nahi pakdi gayi. Seedha type karein.')
      }
    }
    recognition.onend = () => setRecording(false)

    recognitionRef.current = recognition
    recognition.start()
  }, [language, sendMessage])

  const stopRecording = useCallback(() => {
    recognitionRef.current?.stop()
    setRecording(false)
  }, [])

  const handleMicClick = useCallback(() => {
    if (recording) {
      stopRecording()
    } else {
      window.speechSynthesis?.cancel()
      startRecording()
    }
  }, [recording, startRecording, stopRecording])

  const clearChat = useCallback(() => {
    window.speechSynthesis?.cancel()
    setMessages([])
    setTranscript('')
  }, [])

  const speakMessage = useCallback((text) => {
    speakText(text, language)
  }, [language])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100dvh - 64px)', maxWidth: 800, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ padding: '12px 0', marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div>
          <div className="page-title" style={{ fontSize: 18 }}>🌿 Prakriti Saathi</div>
          <div style={{ fontSize: 13, color: 'var(--gray-500)' }}>Aapka Prakritik Kheti Saathi · Natural Farming AI</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => { window.speechSynthesis?.cancel(); setTtsEnabled(e => !e) }}
            style={{ background: 'var(--gray-100)', border: 'none', borderRadius: 'var(--radius-sm)', width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            aria-label={ttsEnabled ? 'Turn off text-to-speech' : 'Turn on text-to-speech'}
            aria-pressed={ttsEnabled}
            title={ttsEnabled ? 'TTS on' : 'TTS off'}
          >
            {ttsEnabled ? <Volume2 size={16} color="var(--green-primary)" /> : <VolumeX size={16} color="var(--gray-400)" />}
          </button>
          <button
            onClick={clearChat}
            style={{ background: 'var(--gray-100)', border: 'none', borderRadius: 'var(--radius-sm)', width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            aria-label="Clear conversation"
            title="Clear chat"
          >
            <Trash2 size={16} color="var(--gray-500)" />
          </button>
        </div>
      </div>

      {/* Browser warning */}
      {showBrowserWarning && !SPEECH_SUPPORTED && (
        <div className="browser-warning" role="alert">
          <AlertTriangle size={16} color="#d97706" style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <strong>Voice input Chrome browser mein best kaam karta hai.</strong> Aap type karke bhi sawaal pooch sakte hain.
            <button onClick={() => setShowBrowserWarning(false)} style={{ marginLeft: 8, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--green-primary)', fontWeight: 600, fontSize: 12 }}>
              Theek hai ✕
            </button>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div
        className="chat-container"
        style={{
          flex: 1, overflowY: 'auto', padding: '8px 0', minHeight: 0
        }}
        role="log"
        aria-live="polite"
        aria-label="Conversation with PrakritiAI"
      >
        {messages.map((msg, i) => (
          <MessageBubble
            key={i}
            msg={msg}
            onSpeak={speakMessage}
            ttsEnabled={ttsEnabled}
            language={language}
          />
        ))}
        {loading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      {messages.length <= 1 && !loading && (
        <div style={{ flexShrink: 0, padding: '8px 0', borderTop: '1px solid var(--gray-100)' }}>
          <div style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 8, fontWeight: 500 }}>
            💬 Jaldi sawaal poochein:
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {QUICK_REPLIES.map(q => (
              <button
                key={q.text}
                onClick={() => sendMessage(q.text)}
                style={{
                  fontSize: 12, padding: '7px 12px',
                  background: 'var(--green-pale)', color: 'var(--green-primary)',
                  border: '1px solid var(--green-pale)', borderRadius: 'var(--radius-full)',
                  cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 500,
                  transition: 'all 0.15s'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--green-primary)'; e.currentTarget.style.color = 'white' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--green-pale)'; e.currentTarget.style.color = 'var(--green-primary)' }}
                aria-label={`Quick question: ${q.text}`}
              >
                {q.icon} {q.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Voice transcript preview */}
      {transcript && (
        <div style={{
          flexShrink: 0, padding: '8px 14px',
          background: 'var(--green-bg)', borderRadius: 'var(--radius-sm)',
          fontSize: 13, color: 'var(--green-primary)', fontStyle: 'italic',
          display: 'flex', alignItems: 'center', gap: 8
        }} aria-live="polite" aria-label="Voice transcript preview">
          <Waveform />
          <span>"{transcript}"</span>
        </div>
      )}

      {/* Input Area */}
      <div className="chat-input-area" style={{ flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {/* Mic Button */}
          <button
            id="mic-btn"
            onClick={handleMicClick}
            className={`mic-btn ${recording ? 'recording' : ''}`}
            disabled={loading}
            aria-label={recording ? 'Stop voice recording' : 'Start voice recording'}
            aria-pressed={recording}
            title={SPEECH_SUPPORTED ? (recording ? 'Recording — click to stop' : 'Click to speak') : 'Voice not available in this browser'}
          >
            {recording ? <MicOff size={22} aria-hidden="true" /> : <Mic size={22} aria-hidden="true" />}
          </button>

          {/* Text Input */}
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              id="chat-text-input"
              ref={inputRef}
              className="form-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage()
                }
              }}
              placeholder={recording ? 'Bol rahe hain... 🎤' : 'Apna sawaal likhein ya mic dabaayen...'}
              disabled={recording || loading}
              aria-label="Type your farming question"
              maxLength={2000}
            />
            {recording && (
              <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}>
                <Waveform />
              </div>
            )}
          </div>

          {/* Send Button */}
          <button
            id="chat-send-btn"
            onClick={() => sendMessage()}
            className="btn btn-primary"
            disabled={!input.trim() || loading || recording}
            aria-label="Send message"
            style={{ flexShrink: 0, height: 44, borderRadius: 'var(--radius-sm)' }}
          >
            <Send size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}
