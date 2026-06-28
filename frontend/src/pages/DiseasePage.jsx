import { useState, useRef, useCallback } from 'react'
import { Upload, Camera, X, AlertCircle, CheckCircle, Leaf } from 'lucide-react'
import { diseaseAPI } from '../utils/api'
import toast from 'react-hot-toast'

const STATUS_COLORS = {
  disease: { bg: '#FEF2F2', border: '#FECACA', text: '#DC2626', label: 'Disease Detected' },
  pest: { bg: '#FFF7ED', border: '#FED7AA', text: '#EA580C', label: 'Pest Detected' },
  deficiency: { bg: '#FEFCE8', border: '#FDE68A', text: '#CA8A04', label: 'Nutrient Deficiency' },
  healthy: { bg: '#F0FDF4', border: '#BBF7D0', text: '#16A34A', label: 'Healthy Crop' },
}

export default function DiseasePage() {
  const [image, setImage] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)

  const handleFile = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) { toast.error('Please select an image file'); return }
    if (file.size > 10 * 1024 * 1024) { toast.error('Image too large. Max 10MB.'); return }
    setImage(URL.createObjectURL(file))
    setImageFile(file)
    setResult(null)
  }

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }, [])

  const analyze = async () => {
    if (!imageFile) return
    setLoading(true)
    try {
      const form = new FormData()
      form.append('file', imageFile)
      const r = await diseaseAPI.diagnose(form)
      setResult(r.data.result)
      toast.success('Analysis complete!')
    } catch (e) {
      toast.error('Analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => { setImage(null); setImageFile(null); setResult(null) }

  const statusInfo = result ? (STATUS_COLORS[result.status] || STATUS_COLORS.disease) : null

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <div className="page-title">Crop Doctor</div>
        <div className="page-subtitle">Upload or capture a crop image to identify diseases, pests, and deficiencies with natural treatment advice</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1.4fr' : '1fr', gap: 20 }}>
        {/* Upload Section */}
        <div>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {!image ? (
              <div
                className={`upload-zone ${dragging ? 'dragging' : ''}`}
                style={{ margin: 0, borderRadius: 0, border: 'none', padding: '48px 24px' }}
                onDragOver={e => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--green-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Upload size={28} color="var(--green-primary)" />
                </div>
                <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--gray-800)', marginBottom: 8 }}>
                  Upload Plant Image
                </div>
                <div style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 20 }}>
                  Drag and drop or click to browse. JPG, PNG up to 10MB.
                </div>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    className="btn btn-primary"
                    onClick={e => { e.stopPropagation(); fileInputRef.current?.click() }}
                  >
                    <Upload size={15} /> Choose File
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={e => { e.stopPropagation(); cameraInputRef.current?.click() }}
                  >
                    <Camera size={15} /> Open Camera
                  </button>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
                <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
              </div>
            ) : (
              <div style={{ position: 'relative', overflow: 'hidden' }}>
                <img src={image} alt="Crop" style={{ width: '100%', maxHeight: 340, objectFit: 'cover', display: 'block' }} />
                
                {/* Simulated Bounding Box Overlay for visual polish */}
                {result && !loading && (
                  <div style={{
                    position: 'absolute',
                    top: '15%', left: '20%', width: '60%', height: '70%',
                    border: `2px solid ${statusInfo?.text || '#16A34A'}`,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 0 0 9999px rgba(0,0,0,0.4)',
                    pointerEvents: 'none',
                    animation: 'fade-in 0.5s ease-out'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: -24, left: -2,
                      background: statusInfo?.text || '#16A34A',
                      color: 'white',
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '4px 8px',
                      borderRadius: '4px 4px 0 0',
                      whiteSpace: 'nowrap'
                    }}>
                      {result.disease_name} • {result.confidence}%
                    </div>
                  </div>
                )}

                <button
                  onClick={reset}
                  style={{
                    position: 'absolute', top: 10, right: 10, width: 32, height: 32,
                    borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: 'none',
                    color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 10
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {image && (
              <div style={{ padding: '16px 20px', borderTop: '1px solid var(--gray-100)' }}>
                <button
                  onClick={analyze}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                  disabled={loading}
                >
                  {loading ? (
                    <><span className="loading-spinner" style={{ width: 16, height: 16 }} /> Analyzing...</>
                  ) : (
                    <><Leaf size={16} /> Analyze Crop</>
                  )}
                </button>
                <button onClick={reset} className="btn btn-ghost" style={{ width: '100%', marginTop: 8 }}>
                  Upload Different Image
                </button>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="card" style={{ marginTop: 16, background: 'var(--green-bg)', border: '1px solid var(--green-pale)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--green-primary)', marginBottom: 10 }}>
              Tips for Better Diagnosis
            </div>
            {[
              'Take clear, well-lit photos of affected areas',
              'Include both healthy and affected leaves',
              'Capture multiple angles if possible',
              'Ensure image shows symptoms clearly',
            ].map((tip, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--gray-600)', marginBottom: 6, alignItems: 'flex-start' }}>
                <CheckCircle size={14} color="var(--green-medium)" style={{ marginTop: 2, flexShrink: 0 }} />
                {tip}
              </div>
            ))}
          </div>
        </div>

        {/* Result Section */}
        {result && (
          <div>
            <div className="disease-result">
              {/* Header */}
              <div className="disease-result-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 11, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                      {statusInfo?.label}
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 800 }}>{result.disease_name}</div>
                    {result.crop_detected && (
                      <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>
                        Crop: {result.crop_detected}
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 28, fontWeight: 800 }}>{result.confidence}%</div>
                    <div style={{ fontSize: 11, opacity: 0.8 }}>Confidence</div>
                  </div>
                </div>
                <div style={{ marginTop: 12 }}>
                  <div className="confidence-bar">
                    <div className="confidence-fill" style={{ width: `${result.confidence}%`, background: 'rgba(255,255,255,0.6)' }} />
                  </div>
                </div>
              </div>

              <div className="disease-result-body">
                {/* Reasoning */}
                {result.reasoning && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-700)', marginBottom: 6 }}>Analysis</div>
                    <div style={{ fontSize: 13, color: 'var(--gray-600)', lineHeight: 1.6, padding: '10px 14px', background: 'var(--gray-50)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--green-medium)' }}>
                      {result.reasoning}
                    </div>
                  </div>
                )}

                {/* Symptoms */}
                {result.symptoms_detected?.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-700)', marginBottom: 8 }}>Symptoms Detected</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {result.symptoms_detected.map((s, i) => (
                        <span key={i} className="badge badge-orange">{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Treatment */}
                {result.natural_treatment && (
                  <div style={{ marginBottom: 16, padding: '14px', background: '#F0FDF4', borderRadius: 'var(--radius-sm)', border: '1px solid #BBF7D0' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#16A34A', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Leaf size={14} /> Natural Treatment (Organic Only)
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--gray-700)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                      {result.natural_treatment}
                    </div>
                  </div>
                )}

                {/* Preventive Actions */}
                {result.preventive_actions?.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-700)', marginBottom: 8 }}>Preventive Actions</div>
                    {result.preventive_actions.map((a, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--gray-600)', marginBottom: 6, alignItems: 'flex-start' }}>
                        <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--green-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 10, fontWeight: 700, color: 'var(--green-primary)', marginTop: 1 }}>
                          {i + 1}
                        </div>
                        {a}
                      </div>
                    ))}
                  </div>
                )}

                {/* Timeline and Monitoring */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {result.recovery_timeline && (
                    <div style={{ padding: 12, background: 'var(--blue-light)', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ fontSize: 11, color: 'var(--blue)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>Recovery Timeline</div>
                      <div style={{ fontSize: 13, color: 'var(--gray-700)', fontWeight: 500 }}>{result.recovery_timeline}</div>
                    </div>
                  )}
                  {result.monitoring_tip && (
                    <div style={{ padding: 12, background: 'var(--yellow-light)', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ fontSize: 11, color: 'var(--yellow)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>Monitoring</div>
                      <div style={{ fontSize: 13, color: 'var(--gray-700)' }}>{result.monitoring_tip}</div>
                    </div>
                  )}
                </div>

                {/* Warning */}
                {result.warning && (
                  <div style={{ marginTop: 12, padding: '10px 14px', background: 'var(--orange-light)', borderRadius: 'var(--radius-sm)', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <AlertCircle size={15} color="var(--orange)" style={{ flexShrink: 0, marginTop: 1 }} />
                    <div style={{ fontSize: 13, color: 'var(--gray-700)' }}>{result.warning}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Disclaimer */}
            <div style={{ marginTop: 12, fontSize: 12, color: 'var(--gray-400)', textAlign: 'center', lineHeight: 1.5 }}>
              This diagnosis is AI-assisted. For critical cases, consult your nearest Krishi Vigyan Kendra (KVK).
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
