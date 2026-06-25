'use client'

import { useState } from 'react'
import { useCartStore } from '@/hooks/useCart'
import { formatPrice } from '@/lib/format'
import type { Product } from '@/types'

const CADENAS = [
  { id: 'lisa',      label: 'Lisa',      desc: 'Elegancia minimalista' },
  { id: 'eslabones', label: 'Eslabones', desc: 'Estilo statement' },
  { id: 'snake',     label: 'Snake',     desc: 'La más popular' },
]

const LARGOS = [
  { id: 'S', label: 'S', cm: 16 },
  { id: 'M', label: 'M', cm: 17 },
  { id: 'L', label: 'L', cm: 18 },
  { id: 'XL', label: 'XL', cm: 19 },
]

const PRECIO_BASE = 12990

function PrevisualizacionPulsera({ cadena, dijesSeleccionados }: { cadena: string; dijesSeleccionados: Product[] }) {
  const chainStrokeWidth = cadena === 'snake' ? 7 : cadena === 'eslabones' ? 5 : 3
  const chainDash = cadena === 'eslabones' ? '12 6' : 'none'

  return (
    <svg width="340" height="160" viewBox="0 0 340 160">
      <path d="M30 80 Q170 80 310 80" fill="none" stroke="#A07830" strokeWidth={chainStrokeWidth} strokeLinecap="round" strokeDasharray={chainDash} />
      {cadena === 'snake' && (
        <path d="M30 80 Q170 80 310 80" fill="none" stroke="#C8A96E" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 6" />
      )}
      <rect x="16" y="73" width="16" height="14" rx="4" fill="#A07830" />
      <circle cx="318" cy="80" r="8" fill="none" stroke="#A07830" strokeWidth="2" />
      <circle cx="318" cy="80" r="3" fill="#A07830" />

      {dijesSeleccionados.map((dije, i) => {
        const n = dijesSeleccionados.length
        const step = n <= 1 ? 0 : Math.min(70, 200 / (n - 1))
        const startX = n <= 1 ? 175 : 175 - (step * (n - 1)) / 2
        const x = startX + i * step
        return (
          <g key={`${dije.id}-${i}`}>
            <line x1={x} y1="84" x2={x} y2="100" stroke="#A07830" strokeWidth="1.5" />
            <circle cx={x} cy="99" r="3" fill="none" stroke="#A07830" strokeWidth="1" />
            <circle cx={x} cy="114" r="7" fill="none" stroke="#C8A96E" strokeWidth="1.2" />
            <circle cx={x} cy="114" r="2.5" fill="#A07830" />
          </g>
        )
      })}

      {dijesSeleccionados.length === 0 && (
        <g opacity="0.15">
          <line x1="175" y1="84" x2="175" y2="100" stroke="#A07830" strokeWidth="1.5" />
          <circle cx="175" cy="99" r="3" fill="none" stroke="#A07830" strokeWidth="1" />
          <circle cx="175" cy="118" r="10" fill="none" stroke="#A07830" strokeWidth="1" strokeDasharray="3 2" />
        </g>
      )}
    </svg>
  )
}

export default function CrearPulseraClient({ dijes }: { dijes: Product[] }) {
  const { addItem } = useCartStore()

  const [step, setStep] = useState(1)
  const [cadena, setCadena] = useState<string | null>(null)
  const [largo, setLargo] = useState<string | null>(null)
  const [dijesSeleccionados, setDijesSeleccionados] = useState<Product[]>([])
  const [ordenTexto, setOrdenTexto] = useState('')
  const [dijeModal, setDijeModal] = useState<Product | null>(null)
  const [added, setAdded] = useState(false)

  const precioTotal = PRECIO_BASE + dijesSeleccionados.reduce((sum, d) => sum + d.precio, 0)
  const preciosDijes = dijesSeleccionados.reduce((sum, d) => sum + d.precio, 0)

  function addDije(dije: Product) {
    setDijesSeleccionados(prev => [...prev, dije])
  }

  function removeDijeById(id: string) {
    setDijesSeleccionados(prev => {
      const lastIdx = prev.map((d, i) => d.id === id ? i : -1).filter(i => i >= 0).pop()
      if (lastIdx === undefined) return prev
      return prev.filter((_, i) => i !== lastIdx)
    })
  }

  function handleAgregar() {
    if (!cadena || !largo) return
    const nombres = dijesSeleccionados.map(d => d.nombre).join(', ')
    const descripcion = `Cadena ${cadena}, talla ${largo} (${LARGOS.find(l => l.id === largo)?.cm} cm)${nombres ? ` · Dijes: ${nombres}` : ''}${ordenTexto ? ` · Orden: ${ordenTexto}` : ''}`
    addItem({
      id: `custom-${Date.now()}`,
      slug: 'crear-pulsera',
      nombre: 'Pulsera Personalizada',
      descripcion_corta: descripcion,
      precio: precioTotal,
    }, `${cadena} · ${largo}`)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const canContinue = [cadena !== null, largo !== null, true, true][step - 1]

  return (
    <main>
      {/* Hero */}
      <div style={{ padding: '60px 48px 40px', background: 'var(--verde)', borderBottom: '0.5px solid rgba(245,240,232,0.08)' }}>
        <div style={{ fontSize: '9px', letterSpacing: '0.32em', textTransform: 'uppercase', color: 'var(--dorado-pale)', marginBottom: '16px' }}>
          Personaliza
        </div>
        <h1 style={{ fontFamily: 'var(--ff-serif)', fontSize: '48px', fontWeight: 300, color: 'var(--crema)' }}>
          Crea tu <em style={{ color: 'var(--dorado-pale)', fontStyle: 'italic' }}>pulsera</em>
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px' }}>

        {/* ── Pasos ── */}
        <div style={{ padding: '48px', borderRight: '0.5px solid rgba(28,61,46,0.08)' }}>

          {/* Indicador */}
          <div style={{ display: 'flex', marginBottom: '48px' }}>
            {['Cadena', 'Largo', 'Dijes', 'Confirmar'].map((label, i) => {
              const n = i + 1
              const active = step === n
              const done = step > n
              return (
                <button
                  key={label}
                  onClick={() => done && setStep(n)}
                  style={{
                    flex: 1, padding: '12px 8px', background: 'none', border: 'none',
                    borderBottom: active ? '2px solid var(--dorado)' : done ? '0.5px solid rgba(28,61,46,0.2)' : '0.5px solid rgba(28,61,46,0.1)',
                    cursor: done ? 'pointer' : 'default',
                    display: 'flex', alignItems: 'center', gap: '8px',
                  }}
                >
                  <span style={{
                    width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                    background: active ? 'var(--dorado)' : done ? 'var(--verde)' : 'transparent',
                    border: done || active ? 'none' : '0.5px solid rgba(28,61,46,0.2)',
                    fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: done || active ? 'var(--crema)' : 'var(--verde)',
                  }}>
                    {done ? '✓' : n}
                  </span>
                  <span style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: active ? 'var(--dorado)' : done ? 'var(--verde)' : '#3a6b52' }}>
                    {label}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Paso 1: Cadena */}
          {step === 1 && (
            <div>
              <h2 style={{ fontFamily: 'var(--ff-serif)', fontSize: '30px', fontWeight: 300, color: 'var(--verde)', marginBottom: '28px' }}>
                Elige el tipo de cadena
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '40px' }}>
                {CADENAS.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setCadena(c.id)}
                    style={{
                      textAlign: 'left', padding: '20px 24px', cursor: 'pointer',
                      border: cadena === c.id ? '0.5px solid var(--verde)' : '0.5px solid rgba(28,61,46,0.2)',
                      background: cadena === c.id ? 'rgba(28,61,46,0.03)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div>
                      <p style={{ fontSize: '15px', color: 'var(--verde)', marginBottom: '3px' }}>{c.label}</p>
                      <p style={{ fontSize: '11px', color: '#3a6b52' }}>{c.desc}</p>
                    </div>
                    {cadena === c.id && <span style={{ color: 'var(--verde)', fontSize: '16px' }}>✓</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Paso 2: Largo */}
          {step === 2 && (
            <div>
              <h2 style={{ fontFamily: 'var(--ff-serif)', fontSize: '30px', fontWeight: 300, color: 'var(--verde)', marginBottom: '28px' }}>
                Elige el largo
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '40px' }}>
                {LARGOS.map(l => (
                  <button
                    key={l.id}
                    onClick={() => setLargo(l.id)}
                    style={{
                      padding: '24px 16px', cursor: 'pointer',
                      border: largo === l.id ? '0.5px solid var(--verde)' : '0.5px solid rgba(28,61,46,0.2)',
                      background: largo === l.id ? 'var(--verde)' : 'transparent',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                      transition: 'all 0.15s',
                    }}
                  >
                    <span style={{ fontFamily: 'var(--ff-serif)', fontSize: '26px', fontWeight: 300, color: largo === l.id ? 'var(--crema)' : 'var(--verde)' }}>
                      {l.label}
                    </span>
                    <span style={{ fontSize: '10px', letterSpacing: '0.1em', color: largo === l.id ? 'rgba(245,240,232,0.7)' : '#3a6b52' }}>
                      {l.cm} cm
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Paso 3: Dijes */}
          {step === 3 && (
            <div>
              <h2 style={{ fontFamily: 'var(--ff-serif)', fontSize: '30px', fontWeight: 300, color: 'var(--verde)', marginBottom: '8px' }}>
                Elige tus dijes
              </h2>
              <p style={{ fontSize: '11px', color: '#3a6b52', marginBottom: '28px' }}>
                Usa + para agregar. Puedes repetir el mismo dije más de una vez.
              </p>

              {dijes.length === 0 ? (
                <p style={{ fontSize: '13px', color: '#3a6b52' }}>No hay dijes disponibles en este momento.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'rgba(28,61,46,0.08)', marginBottom: '24px' }}>
                  {dijes.map(d => {
                    const count = dijesSeleccionados.filter(s => s.id === d.id).length
                    return (
                      <div key={d.id} style={{ background: 'var(--crema)', display: 'flex', flexDirection: 'column' }}>
                        {/* Imagen cuadrada */}
                        <div style={{ width: '100%', aspectRatio: '1', background: 'var(--crema-dark)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {d.imagen_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={d.imagen_url} alt={d.imagen_alt ?? d.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                              <circle cx="20" cy="20" r="12" stroke="#A07830" strokeWidth="1" />
                              <circle cx="20" cy="20" r="4" fill="#A07830" />
                            </svg>
                          )}
                        </div>
                        {/* Info */}
                        <div style={{ padding: '12px 14px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', textAlign: 'center' }}>
                          <div style={{ fontFamily: 'var(--ff-serif)', fontSize: '16px', color: 'var(--dorado)' }}>{d.nombre}</div>
                          <div style={{ fontFamily: 'var(--ff-serif)', fontSize: '14px', color: 'var(--dorado)', opacity: 0.8 }}>{formatPrice(d.precio)}</div>
                          <button
                            onClick={() => setDijeModal(d)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#3a6b52', marginBottom: '8px', padding: 0 }}
                          >
                            Ver detalle
                          </button>
                          {/* Contador */}
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <button
                              onClick={() => removeDijeById(d.id)}
                              disabled={count === 0}
                              style={{ width: '30px', height: '30px', border: '0.5px solid rgba(28,61,46,0.2)', background: 'none', cursor: count > 0 ? 'pointer' : 'default', fontSize: '16px', color: count > 0 ? 'var(--verde)' : 'rgba(28,61,46,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
                            >−</button>
                            <div style={{ width: '36px', height: '30px', borderTop: '0.5px solid rgba(28,61,46,0.2)', borderBottom: '0.5px solid rgba(28,61,46,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--ff-serif)', fontSize: '16px', color: 'var(--verde)' }}>
                              {count}
                            </div>
                            <button
                              onClick={() => addDije(d)}
                              style={{ width: '30px', height: '30px', border: '0.5px solid rgba(28,61,46,0.2)', background: 'none', cursor: 'pointer', fontSize: '16px', color: 'var(--verde)', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
                            >+</button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#3a6b52', marginBottom: '8px' }}>
                  Orden de dijes (opcional)
                </label>
                <input
                  className="checkout-input"
                  value={ordenTexto}
                  onChange={e => setOrdenTexto(e.target.value)}
                  placeholder="Ej: corazón en el centro, estrellas a los lados"
                />
              </div>
            </div>
          )}

          {/* Paso 4: Confirmar */}
          {step === 4 && (
            <div>
              <h2 style={{ fontFamily: 'var(--ff-serif)', fontSize: '30px', fontWeight: 300, color: 'var(--verde)', marginBottom: '28px' }}>
                Tu pulsera personalizada
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '36px' }}>
                {[
                  { label: 'Cadena', value: CADENAS.find(c => c.id === cadena)?.label ?? '—' },
                  { label: 'Largo', value: LARGOS.find(l => l.id === largo) ? `${largo} — ${LARGOS.find(l => l.id === largo)!.cm} cm` : '—' },
                  { label: 'Dijes', value: dijesSeleccionados.length > 0 ? dijesSeleccionados.map(d => d.nombre).join(', ') : 'Sin dijes' },
                  ...(ordenTexto ? [{ label: 'Orden', value: ordenTexto }] : []),
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: 'flex', gap: '16px', borderBottom: '0.5px solid rgba(28,61,46,0.08)', paddingBottom: '14px' }}>
                    <span style={{ fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#3a6b52', width: '80px', flexShrink: 0, paddingTop: '3px' }}>{label}</span>
                    <span style={{ fontSize: '14px', color: 'var(--verde)' }}>{value}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={handleAgregar}
                style={{ background: added ? 'var(--verde-mid)' : 'var(--verde)', color: 'var(--crema)', border: 'none', padding: '16px', fontFamily: 'var(--ff-sans)', fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase', cursor: 'pointer', width: '100%', transition: 'all 0.2s' }}
              >
                {added ? '✓ Agregada al carrito' : `+ Agregar al carrito — ${formatPrice(precioTotal)}`}
              </button>
            </div>
          )}

          {/* Navegación */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
            {step > 1 && (
              <button
                onClick={() => setStep(s => s - 1)}
                style={{ background: 'none', border: '0.5px solid rgba(28,61,46,0.2)', color: 'var(--verde)', padding: '12px 24px', cursor: 'pointer', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: 'var(--ff-sans)' }}
              >
                ← Atrás
              </button>
            )}
            {step < 4 && (
              <button
                onClick={() => canContinue && setStep(s => s + 1)}
                disabled={!canContinue}
                style={{ background: 'var(--verde)', color: 'var(--crema)', border: 'none', padding: '12px 32px', cursor: canContinue ? 'pointer' : 'not-allowed', fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', fontFamily: 'var(--ff-sans)', opacity: canContinue ? 1 : 0.4, marginLeft: 'auto' }}
              >
                Siguiente →
              </button>
            )}
          </div>
        </div>

        {/* ── Preview ── */}
        <div style={{ padding: '48px 36px', background: 'var(--crema-dark)', display: 'flex', flexDirection: 'column', gap: '32px', position: 'sticky', top: '0', alignSelf: 'start' }}>
          <div>
            <div style={{ fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--dorado)', marginBottom: '24px' }}>
              Preview en tiempo real
            </div>
            <div style={{ background: 'var(--crema)', padding: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '0.5px solid rgba(28,61,46,0.08)' }}>
              <PrevisualizacionPulsera cadena={cadena ?? 'snake'} dijesSeleccionados={dijesSeleccionados} />
            </div>
          </div>

          <div style={{ borderTop: '0.5px solid rgba(28,61,46,0.1)', paddingTop: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', color: '#3a6b52' }}>Cadena base</span>
              <span style={{ fontFamily: 'var(--ff-serif)', fontSize: '15px', color: 'var(--verde)' }}>{formatPrice(PRECIO_BASE)}</span>
            </div>
            {dijesSeleccionados.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', color: '#3a6b52' }}>
                  {dijesSeleccionados.length} {dijesSeleccionados.length === 1 ? 'dije' : 'dijes'}
                </span>
                <span style={{ fontFamily: 'var(--ff-serif)', fontSize: '15px', color: 'var(--verde)' }}>{formatPrice(preciosDijes)}</span>
              </div>
            )}
            <div style={{ height: '0.5px', background: 'rgba(28,61,46,0.1)', margin: '12px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#3a6b52' }}>Total</span>
              <span style={{ fontFamily: 'var(--ff-serif)', fontSize: '26px', color: 'var(--dorado)' }}>{formatPrice(precioTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de dije */}
      {dijeModal && (
        <>
          <div onClick={() => setDijeModal(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(28,61,46,0.3)', zIndex: 200 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'var(--crema)', padding: '40px', zIndex: 201, width: '320px', boxShadow: '0 20px 60px rgba(28,61,46,0.15)' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              {dijeModal.imagen_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={dijeModal.imagen_url} alt={dijeModal.imagen_alt ?? dijeModal.nombre} style={{ width: '120px', height: '120px', objectFit: 'contain', marginBottom: '12px' }} />
              ) : (
                <div style={{ width: '80px', height: '80px', margin: '0 auto 12px', background: 'var(--crema-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="10" stroke="#A07830" strokeWidth="1.5" />
                    <circle cx="16" cy="16" r="4" fill="#A07830" />
                  </svg>
                </div>
              )}
              <h3 style={{ fontFamily: 'var(--ff-serif)', fontSize: '26px', fontWeight: 300, color: 'var(--verde)', marginBottom: '6px' }}>{dijeModal.nombre}</h3>
              {dijeModal.descripcion_corta && (
                <p style={{ fontSize: '12px', color: '#3a6b52', marginBottom: '8px' }}>{dijeModal.descripcion_corta}</p>
              )}
              <p style={{ fontFamily: 'var(--ff-serif)', fontSize: '18px', color: 'var(--dorado)' }}>{formatPrice(dijeModal.precio)}</p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => { addDije(dijeModal); setDijeModal(null) }}
                style={{ flex: 1, background: 'var(--verde)', color: 'var(--crema)', border: 'none', padding: '12px', cursor: 'pointer', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'var(--ff-sans)' }}
              >
                + Agregar
              </button>
              <button
                onClick={() => setDijeModal(null)}
                style={{ background: 'none', border: '0.5px solid rgba(28,61,46,0.2)', color: 'var(--verde)', padding: '12px 20px', cursor: 'pointer', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: 'var(--ff-sans)' }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  )
}
