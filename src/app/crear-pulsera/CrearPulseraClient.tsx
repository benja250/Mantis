'use client'

import { useState } from 'react'
import { useCartStore } from '@/hooks/useCart'
import { formatPrice } from '@/lib/format'
import type { Product } from '@/types'
import BotonGuiaTallas from '@/components/BotonGuiaTallas'

const PULSERAS_BASE = [
  { id: 'oval', label: 'Eslabón Ovalado', desc: 'Baño oro 18k · Cadena oval clásica', imagen: '/images/pulsera-oval.png' },
  { id: 'rect', label: 'Eslabón Rectangular', desc: 'Baño oro 18k · Cadena eslabón ancho', imagen: '/images/pulsera-rect.png' },
]

const LARGOS = [
  { id: 'S', label: 'S', cm: 16 },
  { id: 'M', label: 'M', cm: 17 },
  { id: 'L', label: 'L', cm: 18 },
  { id: 'XL', label: 'XL', cm: 19 },
]

const PRECIO_BASE = 12990

function getPreviewUrl(dije: { imagen_url?: string; preview_url?: string }): string | undefined {
  // Usar preview_url de la DB si existe; derivar desde imagen_url solo como fallback
  if (dije.preview_url) return dije.preview_url
  if (!dije.imagen_url) return undefined
  return dije.imagen_url.replace('/dijes/', '/dijes-preview/')
}

// Tamaño PNG de cada dije — nunca cambia sin importar cuántos se agreguen
const DIJE_SIZE  = 64
const CANVAS_W   = 340          // siempre fijo, sin scroll
const CX_BASE    = CANVAS_W / 2 // siempre 170
const AVAILABLE  = 260          // espacio horizontal de la cadena
const MAX_STEP   = 92           // separación máx cuando hay pocos dijes
const MIN_STEP   = 16           // separación mín, para 10 dijes muy juntos
const MAX_LETRA  = Math.min(DIJE_SIZE * 1.65, 106)

function calcPulseraLayout(n: number, hasImg: boolean) {
  // step se reduce al agregar más dijes; DIJE_SIZE siempre igual
  const step    = n <= 1 ? 0
    : n === 3   ? 74   // excepción: 3 dijes más pegados que el MAX_STEP daría
    : Math.max(MIN_STEP, Math.min(MAX_STEP, (AVAILABLE - DIJE_SIZE) / (n - 1)))
  const IMG_H   = 110
  const CHAIN_Y = hasImg ? 26 : 80
  const CENTER_Y = CHAIN_Y + 8 + DIJE_SIZE / 2
  const SVG_H   = hasImg
    ? (n > 0 ? Math.ceil(CENTER_Y + MAX_LETRA / 2 + 10) : IMG_H + 10)
    : 200
  const startX  = CX_BASE - ((n - 1) * step) / 2
  return { step, IMG_H, CHAIN_Y, CENTER_Y, SVG_H, startX }
}

function PrevisualizacionPulsera({ cadena, dijesSeleccionados, pulseraImg }: { cadena: string; dijesSeleccionados: Product[]; pulseraImg?: string }) {
  const chainStrokeWidth = cadena === 'snake' ? 7 : cadena === 'eslabones' ? 5 : 3
  const chainDash = cadena === 'eslabones' ? '12 6' : 'none'

  const n = dijesSeleccionados.length
  const { step, IMG_H, CHAIN_Y, CENTER_Y, SVG_H, startX } = calcPulseraLayout(n, !!pulseraImg)

  return (
    <svg width="100%" viewBox={`0 0 ${CANVAS_W} ${SVG_H}`} style={{ display: 'block' }}>
      {pulseraImg ? (
        <image href={pulseraImg} x="20" y="0" width="300" height={IMG_H} preserveAspectRatio="xMidYMid meet" />
      ) : (
        <>
          <path d={`M30 ${CHAIN_Y} Q${CX_BASE} ${CHAIN_Y} 310 ${CHAIN_Y}`} fill="none" stroke="#A07830" strokeWidth={chainStrokeWidth} strokeLinecap="round" strokeDasharray={chainDash} />
          {cadena === 'snake' && (
            <path d={`M30 ${CHAIN_Y} Q${CX_BASE} ${CHAIN_Y} 310 ${CHAIN_Y}`} fill="none" stroke="#C8A96E" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 6" />
          )}
          <rect x="16" y={CHAIN_Y - 7} width="16" height="14" rx="4" fill="#A07830" />
          <circle cx="318" cy={CHAIN_Y} r="8" fill="none" stroke="#A07830" strokeWidth="2" />
          <circle cx="318" cy={CHAIN_Y} r="3" fill="#A07830" />
        </>
      )}

      {dijesSeleccionados.map((dije, i) => {
        const x = startX + i * step
        const previewUrl = getPreviewUrl(dije)
        const isLetra = dije.nombre.toLowerCase().includes('letra')
        const renderSize = isLetra ? MAX_LETRA : DIJE_SIZE
        const renderHalf = renderSize / 2
        const dijeTopY = CENTER_Y - renderHalf
        return (
          <g key={`${dije.id}-${i}`}>
            {previewUrl ? (
              <foreignObject x={x - renderHalf} y={dijeTopY} width={renderSize} height={renderSize}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center', display: 'block' }}
                />
              </foreignObject>
            ) : (
              <>
                <circle cx={x} cy={CENTER_Y} r={renderHalf * 0.8} fill="none" stroke="#C8A96E" strokeWidth="1.2" />
                <circle cx={x} cy={CENTER_Y} r={renderHalf * 0.22} fill="#A07830" />
              </>
            )}
          </g>
        )
      })}

      {n === 0 && !pulseraImg && (
        <g opacity="0.15">
          <line x1={CX_BASE} y1="84" x2={CX_BASE} y2="100" stroke="#A07830" strokeWidth="1.5" />
          <circle cx={CX_BASE} cy="99" r="3" fill="none" stroke="#A07830" strokeWidth="1" />
          <circle cx={CX_BASE} cy="118" r="10" fill="none" stroke="#A07830" strokeWidth="1" strokeDasharray="3 2" />
        </g>
      )}
    </svg>
  )
}

export default function CrearPulseraClient({ dijes }: { dijes: Product[] }) {
  const { addItem } = useCartStore()

  console.log('[CrearPulsera] primeros 3 dijes recibidos como prop:',
    dijes.slice(0, 3).map(d => ({ nombre: d.nombre, imagen_url: d.imagen_url ?? 'null', preview_url: d.preview_url ?? 'null' }))
  )

  const [step, setStep] = useState(1)
  const [cadena, setCadena] = useState<string>(PULSERAS_BASE[0].id)
  const [largo, setLargo] = useState<string | null>(null)
  const [dijesSeleccionados, setDijesSeleccionados] = useState<Product[]>([])
  const [ordenTexto, setOrdenTexto] = useState('')
  const [dijeModal, setDijeModal] = useState<Product | null>(null)
  const [added, setAdded] = useState(false)
  const [generandoImagen, setGenerandoImagen] = useState(false)
  const [showDijeInfo, setShowDijeInfo] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)

  const precioTotal = PRECIO_BASE + dijesSeleccionados.reduce((sum, d) => sum + d.precio, 0)
  const preciosDijes = dijesSeleccionados.reduce((sum, d) => sum + d.precio, 0)

  function addDije(dije: Product) {
    setDijesSeleccionados(prev => prev.length >= 10 ? prev : [...prev, dije])
  }

  function removeDijeById(id: string) {
    setDijesSeleccionados(prev => {
      const lastIdx = prev.map((d, i) => d.id === id ? i : -1).filter(i => i >= 0).pop()
      if (lastIdx === undefined) return prev
      return prev.filter((_, i) => i !== lastIdx)
    })
  }

  async function generarImagenPulsera(): Promise<string | undefined> {
    const n = dijesSeleccionados.length
    const pulseraBase = PULSERAS_BASE.find(p => p.id === cadena)

    const { step, IMG_H, CHAIN_Y, CENTER_Y, SVG_H, startX } = calcPulseraLayout(n, !!pulseraBase?.imagen)

    async function toBase64(url: string): Promise<string | null> {
      try {
        const res = await fetch(url)
        if (!res.ok) return null
        const blob = await res.blob()
        return await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(blob)
        })
      } catch { return null }
    }

    const [pulseraB64, ...dijeBases64] = await Promise.all([
      pulseraBase?.imagen ? toBase64(pulseraBase.imagen) : Promise.resolve(null),
      ...dijesSeleccionados.map(dije => {
        const url = getPreviewUrl(dije)
        console.log(`[CrearPulsera] generando imagen — dije "${dije.nombre}" preview_url usado:`, url ?? 'null')
        return url ? toBase64(url) : Promise.resolve(null)
      }),
    ])

    const pulseraEl = pulseraB64
      ? `<image href="${pulseraB64}" x="20" y="0" width="300" height="${IMG_H}" preserveAspectRatio="xMidYMid meet"/>`
      : `<path d="M30 ${CHAIN_Y} Q${CX_BASE} ${CHAIN_Y} 310 ${CHAIN_Y}" fill="none" stroke="#A07830" stroke-width="3" stroke-linecap="round"/>` +
        `<rect x="16" y="${CHAIN_Y - 7}" width="16" height="14" rx="4" fill="#A07830"/>` +
        `<circle cx="318" cy="${CHAIN_Y}" r="8" fill="none" stroke="#A07830" stroke-width="2"/>` +
        `<circle cx="318" cy="${CHAIN_Y}" r="3" fill="#A07830"/>`

    const dijeEls = dijesSeleccionados.map((dije, i) => {
      const x = startX + i * step
      const b64 = dijeBases64[i]
      const isLetra = dije.nombre.toLowerCase().includes('letra')
      const renderSize = isLetra ? MAX_LETRA : DIJE_SIZE
      const renderHalf = renderSize / 2
      const dijeTopY = CENTER_Y - renderHalf
      if (!b64) {
        return `<circle cx="${x}" cy="${CENTER_Y}" r="${renderHalf * 0.8}" fill="none" stroke="#C8A96E" stroke-width="1.2"/>` +
          `<circle cx="${x}" cy="${CENTER_Y}" r="${renderHalf * 0.22}" fill="#A07830"/>`
      }
      return `<image href="${b64}" x="${x - renderHalf}" y="${dijeTopY}" width="${renderSize}" height="${renderSize}" preserveAspectRatio="xMidYMid meet"/>`
    }).join('')

    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CANVAS_W} ${SVG_H}">` +
      `<rect width="${CANVAS_W}" height="${SVG_H}" fill="#F5F0E8"/>` +
      pulseraEl + dijeEls + '</svg>'

    return 'data:image/svg+xml,' + encodeURIComponent(svg)
  }

  async function handleAgregar() {
    if (!largo) return
    setGenerandoImagen(true)
    const pulseraBase = PULSERAS_BASE.find(p => p.id === cadena)
    const pulsera = pulseraBase?.label ?? cadena
    const nombres = dijesSeleccionados.map(d => d.nombre).join(', ')
    const descripcion = `${pulsera}, talla ${largo} (${LARGOS.find(l => l.id === largo)?.cm} cm)${nombres ? ` · Dijes: ${nombres}` : ''}${ordenTexto ? ` · Orden: ${ordenTexto}` : ''}`
    const imagen_url = await generarImagenPulsera()
    setGenerandoImagen(false)
    const desglose = {
      cadena: { nombre: `${pulsera} · Talla ${largo}`, precio: PRECIO_BASE },
      dijes: dijesSeleccionados.map(d => ({ nombre: d.nombre, precio: d.precio })),
    }
    addItem({
      id: `custom-${Date.now()}`,
      slug: 'crear-pulsera',
      nombre: 'Pulsera Personalizada',
      descripcion_corta: descripcion,
      precio: precioTotal,
      imagen_url,
    }, `${pulsera} · ${largo}`, undefined, desglose)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const canContinue = [true, largo !== null, true, true][step - 1]

  return (
    <main>
      {/* Hero */}
      <div className="crear-pulsera-hero" style={{ padding: '60px 48px 40px', background: 'var(--verde)', borderBottom: '0.5px solid rgba(245,240,232,0.08)' }}>
        <div style={{ fontSize: '9px', letterSpacing: '0.32em', textTransform: 'uppercase', color: 'var(--dorado-pale)', marginBottom: '16px' }}>
          Personaliza
        </div>
        <h1 style={{ fontFamily: 'var(--ff-serif)', fontSize: '48px', fontWeight: 300, color: 'var(--crema)' }}>
          Crea tu <em style={{ color: 'var(--dorado-pale)', fontStyle: 'italic' }}>pulsera</em>
        </h1>
      </div>

      <div className="crear-pulsera-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 400px' }}>

        {/* ── Pasos ── */}
        <div className="crear-pulsera-steps" style={{ padding: '48px', borderRight: '0.5px solid rgba(28,61,46,0.08)' }}>

          {/* Indicador */}
          <div style={{ display: 'flex', marginBottom: '48px' }}>
            {['Pulsera', 'Largo', 'Dijes', 'Confirmar'].map((label, i) => {
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
                  <span className="crear-paso-label" style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: active ? 'var(--dorado)' : done ? 'var(--verde)' : '#3a6b52' }}>
                    {label}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Paso 1: Pulsera base */}
          {step === 1 && (
            <div>
              <h2 style={{ fontFamily: 'var(--ff-serif)', fontSize: '30px', fontWeight: 300, color: 'var(--verde)', marginBottom: '28px' }}>
                Tu pulsera base
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '40px' }}>
                {PULSERAS_BASE.map(p => {
                  const sel = cadena === p.id
                  return (
                    <button
                      key={p.id}
                      onClick={() => setCadena(p.id)}
                      style={{
                        padding: 0, cursor: 'pointer', textAlign: 'left',
                        border: sel ? '1.5px solid var(--verde)' : '0.5px solid rgba(28,61,46,0.2)',
                        background: sel ? 'rgba(28,61,46,0.04)' : 'transparent',
                        display: 'flex', flexDirection: 'column',
                        transition: 'all 0.15s',
                      }}
                    >
                      {/* Imagen */}
                      <div style={{ width: '100%', aspectRatio: '3/1', background: 'var(--crema-dark)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 24px', boxSizing: 'border-box' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.imagen} alt={p.label} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      </div>
                      {/* Info */}
                      <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                        <div>
                          <p style={{ fontFamily: 'var(--ff-serif)', fontSize: '16px', color: 'var(--verde)', marginBottom: '3px' }}>{p.label}</p>
                          <p style={{ fontSize: '10px', color: '#3a6b52', letterSpacing: '0.06em', lineHeight: 1.5 }}>{p.desc}</p>
                        </div>
                        {sel && <span style={{ color: 'var(--verde)', fontSize: '16px', flexShrink: 0, marginTop: '2px' }}>✓</span>}
                      </div>
                    </button>
                  )
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '40px' }}>
                <button
                  onClick={() => setStep(2)}
                  style={{ background: 'var(--verde)', color: 'var(--crema)', border: 'none', padding: '12px 32px', cursor: 'pointer', fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', fontFamily: 'var(--ff-sans)' }}
                >
                  Siguiente →
                </button>
              </div>

              {/* Preview de dijes disponibles */}
              {dijes.length > 0 && (
                <div>
                  <div style={{ fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#3a6b52', marginBottom: '12px' }}>
                    Dijes disponibles
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                    {dijes.map(d => (
                      <button
                        key={d.id}
                        onClick={() => setShowDijeInfo(true)}
                        style={{ padding: 0, border: '0.5px solid rgba(28,61,46,0.12)', background: 'var(--crema-dark)', cursor: 'pointer', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
                      >
                        <div style={{ width: '100%', aspectRatio: '1', overflow: 'hidden' }}>
                          {d.imagen_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={d.imagen_url} alt={d.imagen_alt ?? d.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <circle cx="10" cy="10" r="7" stroke="#A07830" strokeWidth="1" />
                                <circle cx="10" cy="10" r="2.5" fill="#A07830" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div style={{ padding: '4px 6px 6px', fontSize: '9px', letterSpacing: '0.04em', color: '#3a6b52', textAlign: 'center', lineHeight: 1.3 }}>
                          {d.nombre}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Paso 2: Largo */}
          {step === 2 && (
            <div>
              <h2 style={{ fontFamily: 'var(--ff-serif)', fontSize: '30px', fontWeight: 300, color: 'var(--verde)', marginBottom: '28px' }}>
                Elige el largo
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '12px' }}>
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
              <div style={{ marginBottom: '40px' }}>
                <BotonGuiaTallas />
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
                <div className="crear-pulsera-dijes-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', background: 'var(--crema-dark)', marginBottom: '24px' }}>
                  {dijes.map(d => {
                    const count = dijesSeleccionados.filter(s => s.id === d.id).length
                    return (
                      <div
                        key={d.id}
                        onClick={() => setDijeModal(d)}
                        style={{ background: '#faf9f6', display: 'flex', flexDirection: 'column', boxShadow: '0 2px 16px rgba(0,0,0,0.08)', cursor: 'pointer' }}
                      >
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
                          <div style={{ fontFamily: 'var(--ff-serif)', fontSize: '14px', color: 'var(--dorado)', opacity: 0.8, marginBottom: '8px' }}>{formatPrice(d.precio)}</div>
                          {/* Contador */}
                          <div onClick={e => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center' }}>
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
                  { label: 'Pulsera', value: PULSERAS_BASE.find(p => p.id === cadena)?.label ?? '—' },
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
                disabled={generandoImagen || added}
                style={{ background: added ? 'var(--verde-mid)' : 'var(--verde)', color: 'var(--crema)', border: 'none', padding: '16px', fontFamily: 'var(--ff-sans)', fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase', cursor: generandoImagen ? 'not-allowed' : 'pointer', width: '100%', transition: 'all 0.2s', opacity: generandoImagen ? 0.7 : 1 }}
              >
                {generandoImagen ? 'Preparando…' : added ? '✓ Agregada al carrito' : `+ Agregar al carrito — ${formatPrice(precioTotal)}`}
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
            {step > 1 && step < 4 && (
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
        <div className="crear-pulsera-preview" style={{ padding: '48px 36px', background: 'var(--crema-dark)', display: 'flex', flexDirection: 'column', gap: '32px', position: 'sticky', top: '0', alignSelf: 'start' }}>
          <div>
            <div style={{ fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--dorado)', marginBottom: '24px' }}>
              Preview en tiempo real
            </div>
            {/* Compositor unificado: foto pulsera + dijes */}
            {(() => {
              const pulseraImg = PULSERAS_BASE.find(p => p.id === cadena)?.imagen
              const dijosActivos = step >= 3 ? dijesSeleccionados : []
              return (
                <>
                  <div
                    onClick={() => setPreviewOpen(true)}
                    style={{ background: 'var(--crema)', border: '0.5px solid rgba(28,61,46,0.08)', padding: '20px 12px 12px', cursor: 'zoom-in', position: 'relative' }}
                  >
                    <PrevisualizacionPulsera cadena={cadena} dijesSeleccionados={dijosActivos} pulseraImg={pulseraImg} />
                    <div style={{ position: 'absolute', bottom: '8px', right: '10px', fontSize: '8px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#3a6b52', opacity: 0.35 }}>
                      Ver detalle
                    </div>
                  </div>

                  {/* Modal de zoom */}
                  {previewOpen && (
                    <>
                      <div onClick={() => setPreviewOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(28,61,46,0.45)', backdropFilter: 'blur(4px)', zIndex: 300 }} />
                      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 301, background: 'var(--crema)', padding: '40px 36px 32px', width: 'min(640px, calc(100vw - 48px))', boxShadow: '0 24px 80px rgba(28,61,46,0.2)' }}>
                        <button onClick={() => setPreviewOpen(false)} style={{ position: 'absolute', top: '16px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '22px', color: 'rgba(28,61,46,0.4)', lineHeight: 1 }}>×</button>
                        <div style={{ fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--dorado)', marginBottom: '20px' }}>Tu pulsera</div>
                        <PrevisualizacionPulsera cadena={cadena} dijesSeleccionados={dijosActivos} pulseraImg={pulseraImg} />
                        {dijosActivos.length > 0 && (
                          <div style={{ marginTop: '20px', borderTop: '0.5px solid rgba(28,61,46,0.08)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <div style={{ fontSize: '10px', color: '#3a6b52', letterSpacing: '0.06em' }}>
                              {PULSERAS_BASE.find(p => p.id === cadena)?.label} · Talla {largo}
                            </div>
                            {dijosActivos.map((d, i) => (
                              <div key={i} style={{ fontSize: '10px', color: '#3a6b52', letterSpacing: '0.06em' }}>{d.nombre}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </>
              )
            })()}
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

          {step === 3 && (
            <div style={{ borderTop: '0.5px solid rgba(28,61,46,0.1)', paddingTop: '24px' }}>
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
          )}

          {step === 3 && (
            <div style={{ borderTop: '0.5px solid rgba(28,61,46,0.1)', paddingTop: '24px', display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setStep(s => s - 1)}
                style={{ background: 'none', border: '0.5px solid rgba(28,61,46,0.2)', color: 'var(--verde)', padding: '12px 16px', cursor: 'pointer', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: 'var(--ff-sans)' }}
              >
                ← Atrás
              </button>
              <button
                onClick={() => setStep(4)}
                style={{ flex: 1, background: 'var(--verde)', color: 'var(--crema)', border: 'none', padding: '12px', cursor: 'pointer', fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', fontFamily: 'var(--ff-sans)' }}
              >
                Siguiente →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal info dijes (paso 1) */}
      {showDijeInfo && (
        <>
          <div onClick={() => setShowDijeInfo(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(20,40,30,0.55)', backdropFilter: 'blur(4px)', zIndex: 200 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'var(--crema)', zIndex: 201, width: 'min(400px, calc(100vw - 32px))', padding: '40px 36px', textAlign: 'center', boxShadow: '0 24px 80px rgba(28,61,46,0.2)' }}>
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>🌿</div>
            <h3 style={{ fontFamily: 'var(--ff-serif)', fontSize: '24px', fontWeight: 300, color: 'var(--verde)', marginBottom: '14px', lineHeight: 1.2 }}>
              Los dijes van con tu pulsera
            </h3>
            <p style={{ fontSize: '13px', color: '#3a6b52', lineHeight: 1.8, marginBottom: '28px' }}>
              Los dijes solo se venden junto con la pulsera personalizada. Sigue los pasos para armar la tuya.
            </p>
            <button
              onClick={() => setShowDijeInfo(false)}
              style={{ background: 'var(--verde)', color: 'var(--crema)', border: 'none', padding: '13px 36px', cursor: 'pointer', fontSize: '10px', letterSpacing: '0.24em', textTransform: 'uppercase', fontFamily: 'var(--ff-sans)' }}
            >
              Continuar →
            </button>
          </div>
        </>
      )}

      {/* Modal de dije */}
      {dijeModal && (
        <>
          <div
            onClick={() => setDijeModal(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(20,40,30,0.55)', backdropFilter: 'blur(4px)', zIndex: 200 }}
          />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'var(--crema)', zIndex: 201, width: 'min(720px, calc(100vw - 32px))', maxHeight: 'calc(100vh - 48px)', overflow: 'hidden auto', boxShadow: '0 24px 80px rgba(28,61,46,0.2)' }}>
            {/* Imagen grande */}
            <div style={{ width: '100%', aspectRatio: '4/3', background: 'var(--crema-dark)', position: 'relative', overflow: 'hidden' }}>
              {dijeModal.imagen_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={dijeModal.imagen_url} alt={dijeModal.imagen_alt ?? dijeModal.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="14" stroke="#A07830" strokeWidth="1.5" />
                    <circle cx="24" cy="24" r="5" fill="#A07830" />
                  </svg>
                </div>
              )}
              <button
                onClick={() => setDijeModal(null)}
                style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(245,240,232,0.9)', border: 'none', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '13px', color: 'var(--verde)' }}
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>
            {/* Info + acciones */}
            <div style={{ padding: '24px 28px 28px' }}>
              <h3 style={{ fontFamily: 'var(--ff-serif)', fontSize: '26px', fontWeight: 300, color: 'var(--verde)', marginBottom: '4px' }}>{dijeModal.nombre}</h3>
              {dijeModal.descripcion_corta && (
                <p style={{ fontSize: '12px', color: '#3a6b52', lineHeight: 1.7, marginBottom: '10px' }}>{dijeModal.descripcion_corta}</p>
              )}
              <p style={{ fontFamily: 'var(--ff-serif)', fontSize: '20px', color: 'var(--dorado)', marginBottom: '20px' }}>{formatPrice(dijeModal.precio)}</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => { addDije(dijeModal); setDijeModal(null) }}
                  style={{ flex: 1, background: 'var(--verde)', color: 'var(--crema)', border: 'none', padding: '13px', cursor: 'pointer', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'var(--ff-sans)' }}
                >
                  + Agregar
                </button>
                <button
                  onClick={() => setDijeModal(null)}
                  style={{ background: 'none', border: '0.5px solid rgba(28,61,46,0.2)', color: 'var(--verde)', padding: '13px 20px', cursor: 'pointer', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: 'var(--ff-sans)' }}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  )
}
