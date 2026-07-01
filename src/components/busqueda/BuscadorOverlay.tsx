'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'

interface ProductoResultado {
  id: string
  slug: string
  nombre: string
  precio: number
  imagen_url?: string
  categoria_slug?: string
}

interface Props {
  open: boolean
  onClose: () => void
}

function formatCLP(n: number) {
  return '$' + n.toLocaleString('es-CL')
}

export default function BuscadorOverlay({ open, onClose }: Props) {
  const [query, setQuery] = useState('')
  const [resultados, setResultados] = useState<ProductoResultado[]>([])
  const [cargando, setCargando] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (open) {
      setQuery('')
      setResultados([])
      setTimeout(() => inputRef.current?.focus(), 60)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const buscar = useCallback(async (q: string) => {
    if (q.trim().length < 2) { setResultados([]); return }
    setCargando(true)
    try {
      const res = await fetch(`/api/buscar?q=${encodeURIComponent(q.trim())}`)
      if (res.ok) {
        const data = await res.json()
        setResultados(data.productos ?? [])
      }
    } finally {
      setCargando(false)
    }
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setQuery(val)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => buscar(val), 300)
  }

  if (!open) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(28,61,46,0.7)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '80px',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        width: '100%',
        maxWidth: '600px',
        background: 'var(--crema)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
        margin: '0 16px',
        maxHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Input */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          borderBottom: '0.5px solid rgba(28,61,46,0.12)',
          padding: '0 20px',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, opacity: 0.4 }}>
            <circle cx="11" cy="11" r="7" stroke="#1C3D2E" strokeWidth="1.5" />
            <path d="M16.5 16.5L21 21" stroke="#1C3D2E" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={handleChange}
            placeholder="Buscar productos..."
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              padding: '18px 14px',
              fontFamily: 'var(--ff-sans)',
              fontSize: '15px',
              color: 'var(--verde)',
              outline: 'none',
            }}
          />
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              color: '#3a6b52',
              fontSize: '20px',
              lineHeight: 1,
              flexShrink: 0,
            }}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        {/* Resultados */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {cargando && (
            <div style={{ padding: '24px', textAlign: 'center', fontSize: '12px', color: '#3a6b52', opacity: 0.6 }}>
              Buscando...
            </div>
          )}

          {!cargando && query.trim().length >= 2 && resultados.length === 0 && (
            <div style={{ padding: '32px', textAlign: 'center' }}>
              <p style={{ fontSize: '14px', color: '#3a6b52', fontFamily: 'var(--ff-serif)', fontStyle: 'italic' }}>
                Sin resultados para &ldquo;{query}&rdquo;
              </p>
            </div>
          )}

          {!cargando && resultados.length > 0 && (
            <div>
              {resultados.map(p => (
                <Link
                  key={p.id}
                  href={`/producto/${p.slug}`}
                  onClick={onClose}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '14px 20px',
                    borderBottom: '0.5px solid rgba(28,61,46,0.06)',
                    textDecoration: 'none',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--crema-dark)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{
                    width: '52px',
                    height: '52px',
                    background: 'var(--crema-dark)',
                    flexShrink: 0,
                    position: 'relative',
                    overflow: 'hidden',
                  }}>
                    {p.imagen_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.imagen_url}
                        alt={p.nombre}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: 'var(--ff-serif)',
                      fontSize: '16px',
                      fontWeight: 300,
                      color: 'var(--verde)',
                      marginBottom: '2px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {p.nombre}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: 'var(--dorado)',
                      fontFamily: 'var(--ff-sans)',
                    }}>
                      {formatCLP(p.precio)}
                    </div>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.3, flexShrink: 0 }}>
                    <path d="M9 18l6-6-6-6" stroke="#1C3D2E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              ))}
            </div>
          )}

          {!query.trim() && (
            <div style={{ padding: '28px 20px' }}>
              <p style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#3a6b52', opacity: 0.5, marginBottom: '16px' }}>
                Sugerencias
              </p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {['Pulsera', 'Collar'].map(s => (
                  <button
                    key={s}
                    onClick={() => { setQuery(s); buscar(s) }}
                    style={{
                      background: 'var(--crema-dark)',
                      border: '0.5px solid rgba(28,61,46,0.1)',
                      padding: '6px 14px',
                      fontFamily: 'var(--ff-sans)',
                      fontSize: '11px',
                      cursor: 'pointer',
                      color: 'var(--verde)',
                      letterSpacing: '0.06em',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
