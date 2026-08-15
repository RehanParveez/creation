import { useEffect, useState } from 'react'

interface HealthStatus {
  status: string
  version?: string
}

function App() {
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8014'
        const res = await fetch(`${apiUrl}/health`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        setHealth(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    checkHealth()
  }, [])

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#020617',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        fontFamily: "'Inter', system-ui, sans-serif",
        color: '#f8fafc',
        padding: '24px',
      }}
    >

      <div
        style={{
          width: 64,
          height: 64,
          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          fontSize: 28,
          color: '#020617',
          boxShadow: '0 0 30px rgba(245, 158, 11, 0.2)',
        }}
      >
        T
      </div>

      <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, letterSpacing: '-0.5px' }}>
        Tameer
      </h1>
      <p style={{ color: '#94a3b8', fontSize: 15, margin: 0 }}>
        Construction project control platform
      </p>

      <div
        style={{
          marginTop: 16,
          background: '#0f172a',
          border: '1px solid #334155',
          borderRadius: 12,
          padding: '20px 28px',
          minWidth: 320,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: '#64748b',
            marginBottom: 12,
            fontWeight: 600,
          }}
        >
          Backend Health
        </div>

        {loading && (
          <div style={{ color: '#94a3b8', fontSize: 14 }}>Checking connection…</div>
        )}

        {!loading && error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              color: '#ef4444',
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            <span>●</span>
            <span>Backend unreachable — {error}</span>
          </div>
        )}

        {!loading && health && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              color: '#10b981',
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#10b981',
                animation: 'pulse 2s infinite',
              }}
            />
            <span>Connected — {health.status}</span>
          </div>
        )}

        <div
          style={{
            marginTop: 12,
            fontSize: 12,
            color: '#64748b',
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {import.meta.env.VITE_API_BASE_URL || 'http://localhost:8014'}/health
        </div>
      </div>

      <div style={{ marginTop: 24, fontSize: 12, color: '#475569' }}>
        First commit · Docker Compose · FastAPI · React
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}

export default App
