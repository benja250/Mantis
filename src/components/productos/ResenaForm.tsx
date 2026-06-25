'use client'

import { useState } from 'react'

interface Props {
  productoId: string
}

export default function ResenaForm({ productoId }: Props) {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [texto, setTexto] = useState('')
  const [calificacion, setCalificacion] = useState(0)
  const [hover, setHover] = useState(0)
  const [estado, setEstado] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [errMsg, setErrMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!calificacion) { setErrMsg('Selecciona una calificación'); return }
    setEstado('loading')
    try {
      const res = await fetch('/api/resenas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ producto_id: productoId, nombre_cliente: nombre, email, texto, calificacion }),
      })
      const data = await res.json()
      if (!res.ok) {
        setEstado('error')
        setErrMsg(data.error ?? 'Error al enviar')
      } else {
        setEstado('ok')
      }
    } catch {
      setEstado('error')
      setErrMsg('Error de conexión')
    }
  }

  if (estado === 'ok') {
    return (
      <div style={{
        padding: '32px',
        background: 'rgba(160,120,48,0.05)',
        border: '0.5px solid rgba(160,120,48,0.3)',
        textAlign: 'center',
        maxWidth: '560px',
      }}>
        <div style={{ fontFamily: 'var(--ff-serif)', fontSize: '22px', color: 'var(--verde)', marginBottom: '8px' }}>
          ¡Gracias por tu reseña!
        </div>
        <p style={{ fontSize: '13px', color: '#3a6b52' }}>
          Tu reseña será publicada después de ser revisada.
        </p>
      </div>
    )
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'var(--crema)',
    border: '0.5px solid rgba(28,61,46,0.2)',
    padding: '10px 14px',
    fontFamily: 'var(--ff-sans)',
    fontSize: '13px',
    color: 'var(--verde)',
    outline: 'none',
    boxSizing: 'border-box',
  }

  return (
    <div style={{ padding: '48px 48px 64px', borderTop: '0.5px solid rgba(28,61,46,0.1)' }}>
      <h2 style={{
        fontFamily: 'var(--ff-serif)',
        fontSize: '26px',
        fontWeight: 300,
        color: 'var(--verde)',
        marginBottom: '28px',
      }}>
        Dejar una reseña
      </h2>

      <form onSubmit={handleSubmit} style={{ maxWidth: '560px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Estrellas */}
        <div>
          <div style={{ fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#3a6b52', marginBottom: '8px' }}>
            Calificación
          </div>
          <div style={{ display: 'flex', gap: '4px', cursor: 'pointer' }}>
            {[1, 2, 3, 4, 5].map(i => (
              <svg
                key={i}
                width="28"
                height="28"
                viewBox="0 0 24 24"
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setCalificacion(i)}
              >
                <path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  fill={i <= (hover || calificacion) ? '#A07830' : 'none'}
                  stroke="#A07830"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            ))}
          </div>
        </div>

        {/* Nombre */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#3a6b52', display: 'block', marginBottom: '6px' }}>
              Nombre
            </label>
            <input
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              required
              style={inputStyle}
              placeholder="Tu nombre"
            />
          </div>
          <div>
            <label style={{ fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#3a6b52', display: 'block', marginBottom: '6px' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={inputStyle}
              placeholder="tu@correo.com"
            />
          </div>
        </div>

        {/* Texto */}
        <div>
          <label style={{ fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#3a6b52', display: 'block', marginBottom: '6px' }}>
            Tu experiencia
          </label>
          <textarea
            value={texto}
            onChange={e => setTexto(e.target.value)}
            required
            rows={4}
            style={{ ...inputStyle, resize: 'vertical' }}
            placeholder="Cuéntanos cómo te quedó la joya..."
          />
        </div>

        {errMsg && (
          <p style={{ fontSize: '12px', color: '#C0392B', margin: 0 }}>{errMsg}</p>
        )}

        <button
          type="submit"
          disabled={estado === 'loading'}
          style={{
            background: 'var(--verde)',
            color: 'var(--crema)',
            border: 'none',
            padding: '14px 32px',
            fontFamily: 'var(--ff-sans)',
            fontSize: '10px',
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            cursor: estado === 'loading' ? 'not-allowed' : 'pointer',
            opacity: estado === 'loading' ? 0.7 : 1,
            alignSelf: 'flex-start',
          }}
        >
          {estado === 'loading' ? 'Enviando...' : 'Enviar reseña'}
        </button>
      </form>
    </div>
  )
}
