'use client'

import { useState, type FormEvent } from 'react'

interface Estado {
  orden: string
  estado: 'pendiente' | 'confirmado' | 'procesando' | 'despachado' | 'entregado'
  nombre: string
  fecha: string
  courier?: string
  tracking?: string
}

const ESTADOS: Record<Estado['estado'], { label: string; desc: string }> = {
  pendiente:   { label: 'Pendiente de pago',  desc: 'Esperando confirmación de transferencia.' },
  confirmado:  { label: 'Pago confirmado',    desc: 'Tu pago fue recibido. Preparando tu pedido.' },
  procesando:  { label: 'Preparando pedido',  desc: 'Tu joya está siendo empacada con cuidado.' },
  despachado:  { label: 'En camino',          desc: 'Tu pedido ya fue despachado.' },
  entregado:   { label: 'Entregado',          desc: '¡Tu pedido llegó! Esperamos que lo ames.' },
}

const STEPS: Estado['estado'][] = ['pendiente', 'confirmado', 'procesando', 'despachado', 'entregado']

export default function SeguimientoPage() {
  const [orden, setOrden] = useState('')
  const [resultado, setResultado] = useState<Estado | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function buscar(e: FormEvent) {
    e.preventDefault()
    if (!orden.trim()) return
    setLoading(true)
    setError('')
    setResultado(null)
    try {
      const res = await fetch(`/api/seguimiento?orden=${encodeURIComponent(orden.trim())}`)
      const data = await res.json()
      if (!res.ok || !data.orden) {
        setError('No encontramos un pedido con ese número. Verifica que el número sea correcto.')
      } else {
        setResultado(data)
      }
    } catch {
      setError('Error al consultar. Intenta de nuevo o contáctanos por WhatsApp.')
    } finally {
      setLoading(false)
    }
  }

  const stepIdx = resultado ? STEPS.indexOf(resultado.estado) : -1

  return (
    <main>
      <div style={{
        padding: '80px 48px 60px',
        background: 'var(--crema-dark)',
        borderBottom: '0.5px solid rgba(28,61,46,0.1)',
      }}>
        <div style={{
          fontSize: '9px', letterSpacing: '0.32em', textTransform: 'uppercase',
          color: 'var(--dorado)', marginBottom: '20px',
        }}>
          Estado de pedido
        </div>
        <h1 style={{
          fontFamily: 'var(--ff-serif)', fontSize: '52px', fontWeight: 300, color: 'var(--verde)',
        }}>
          Seguimiento<br />
          <em style={{ color: 'var(--dorado)', fontStyle: 'italic' }}>de tu pedido</em>
        </h1>
      </div>

      <div style={{ padding: '64px 48px', maxWidth: '560px' }}>
        <form onSubmit={buscar} style={{ marginBottom: '48px' }}>
          <label style={{
            display: 'block', fontSize: '9px', letterSpacing: '0.22em',
            textTransform: 'uppercase', color: '#3a6b52', marginBottom: '10px',
          }}>
            Número de orden
          </label>
          <div style={{ display: 'flex', gap: '0' }}>
            <input
              className="checkout-input"
              value={orden}
              onChange={e => setOrden(e.target.value)}
              placeholder="MTS-00123"
              style={{ borderRight: 'none', flex: 1 }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                background: 'var(--verde)', color: 'var(--crema)',
                border: 'none', padding: '0 28px',
                fontFamily: 'var(--ff-sans)', fontSize: '10px',
                letterSpacing: '0.2em', textTransform: 'uppercase',
                cursor: loading ? 'wait' : 'pointer', flexShrink: 0,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? '...' : 'Buscar'}
            </button>
          </div>
          {error && (
            <p style={{ marginTop: '12px', fontSize: '12px', color: '#C0392B', lineHeight: 1.7 }}>
              {error}
            </p>
          )}
        </form>

        {resultado && (
          <div>
            <div style={{ marginBottom: '32px' }}>
              <p style={{
                fontFamily: 'var(--ff-serif)', fontSize: '22px', color: 'var(--verde)', marginBottom: '4px',
              }}>
                Orden {resultado.orden}
              </p>
              <p style={{ fontSize: '11px', color: '#3a6b52', letterSpacing: '0.06em' }}>
                {resultado.nombre} · {resultado.fecha}
              </p>
            </div>

            {/* Timeline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {STEPS.map((step, i) => {
                const done = i <= stepIdx
                const active = i === stepIdx
                const info = ESTADOS[step]
                return (
                  <div key={step} style={{
                    display: 'flex', gap: '20px', alignItems: 'flex-start',
                    padding: '20px 0',
                    borderBottom: '0.5px solid rgba(28,61,46,0.08)',
                    opacity: done ? 1 : 0.35,
                  }}>
                    <div style={{
                      width: '20px', height: '20px', flexShrink: 0, borderRadius: '50%',
                      background: active ? 'var(--dorado)' : done ? 'var(--verde)' : 'transparent',
                      border: done ? 'none' : '0.5px solid rgba(28,61,46,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginTop: '2px',
                    }}>
                      {done && !active && (
                        <svg width="10" height="10" viewBox="0 0 10 10">
                          <path d="M2 5l2 2 4-4" stroke="var(--crema)" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p style={{
                        fontSize: '13px', color: active ? 'var(--dorado)' : 'var(--verde)',
                        fontWeight: active ? 400 : 300, marginBottom: '3px',
                      }}>
                        {info.label}
                      </p>
                      {active && (
                        <p style={{ fontSize: '11px', color: '#3a6b52', lineHeight: 1.7 }}>
                          {info.desc}
                          {step === 'despachado' && resultado.courier && (
                            <> — {resultado.courier}
                              {resultado.tracking && <> · Tracking: <strong>{resultado.tracking}</strong></>}
                            </>
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
