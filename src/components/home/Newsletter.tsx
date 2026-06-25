'use client'

import { useState, type FormEvent } from 'react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [estado, setEstado] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [msg, setMsg] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setEstado('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setEstado('error')
        setMsg(data.error ?? 'Error al suscribir')
      } else {
        setEstado('ok')
        setEmail('')
      }
    } catch {
      setEstado('error')
      setMsg('Error de conexión')
    }
  }

  return (
    <div className="newsletter-section" style={{
      background: 'var(--verde)',
      padding: '56px 48px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '40px',
    }}>
      {/* Texto */}
      <div>
        <div style={{
          fontSize: '9px',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'var(--dorado-pale)',
          opacity: 0.6,
          marginBottom: '12px',
        }}>
          Novedades
        </div>
        <div style={{
          fontFamily: 'var(--ff-serif)',
          fontSize: '30px',
          fontWeight: 300,
          color: 'var(--crema)',
          lineHeight: 1.2,
        }}>
          Sé la primera en ver<br />
          las nuevas <em style={{ color: 'var(--dorado-pale)', fontStyle: 'italic' }}>colecciones</em>
        </div>
      </div>

      {/* Formulario */}
      <div style={{ flexShrink: 0 }}>
        {estado === 'ok' ? (
          <p style={{ color: 'var(--dorado-pale)', fontFamily: 'var(--ff-serif)', fontSize: '18px' }}>
            ¡Gracias! Te avisaremos de las novedades.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="newsletter-form" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex' }}>
              <input
                className="nl-input newsletter-input"
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setEstado('idle') }}
                placeholder="tu@correo.com"
                required
                style={{
                  background: 'rgba(245,240,232,0.08)',
                  border: '0.5px solid rgba(245,240,232,0.2)',
                  borderRight: 'none',
                  color: 'var(--crema)',
                  padding: '13px 20px',
                  width: '280px',
                  fontFamily: 'var(--ff-sans)',
                  fontSize: '12px',
                }}
              />
              <button
                className="nl-btn"
                type="submit"
                disabled={estado === 'loading'}
                style={{
                  background: 'var(--dorado)',
                  color: 'var(--verde)',
                  border: 'none',
                  padding: '13px 24px',
                  fontFamily: 'var(--ff-sans)',
                  fontSize: '10px',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  cursor: estado === 'loading' ? 'not-allowed' : 'pointer',
                  fontWeight: 500,
                  transition: 'background 0.2s',
                  whiteSpace: 'nowrap',
                  opacity: estado === 'loading' ? 0.7 : 1,
                }}
              >
                {estado === 'loading' ? '...' : 'Suscribirse'}
              </button>
            </div>
            {estado === 'error' && (
              <p style={{ margin: 0, fontSize: '11px', color: '#f4a' }}>{msg}</p>
            )}
          </form>
        )}
      </div>
    </div>
  )
}
