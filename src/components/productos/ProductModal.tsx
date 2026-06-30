'use client'

import React, { useState, useEffect } from 'react'
import { useCartStore } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useWishlist'
import { formatPrice } from '@/lib/format'
import { createClient } from '@/lib/supabase/client'
import type { Product, ProductDetail, Variante } from '@/types'
import BotonGuiaTallas from '@/components/BotonGuiaTallas'

interface Props {
  product: Product | null
  onClose: () => void
}

const STOCK_BAJO = 8

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path
        d="M12 21C12 21 3 14 3 8a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6-9 13-9 13z"
        fill={filled ? '#C0392B' : 'none'}
        stroke={filled ? '#C0392B' : 'rgba(28,61,46,0.4)'}
        strokeWidth="1.5"
      />
    </svg>
  )
}

export default function ProductModal({ product: rawProduct, onClose }: Props) {
  const { addItem } = useCartStore()
  const { has, toggle } = useWishlist()

  const [detail, setDetail] = useState<ProductDetail | null>(null)
  const [variante, setVariante] = useState<string | undefined>(undefined)
  const [notifyEmail, setNotifyEmail] = useState('')
  const [notifySent, setNotifySent] = useState(false)
  const [added, setAdded] = useState(false)
  const [stockMsg, setStockMsg] = useState(false)
  const [imgIdx, setImgIdx] = useState(0)

  // Construir ProductDetail cada vez que cambia el producto
  useEffect(() => {
    if (!rawProduct) { setDetail(null); return }

    setVariante(undefined)
    setNotifyEmail('')
    setNotifySent(false)
    setAdded(false)
    setImgIdx(0)

    async function fetchDetail() {
      const sb = createClient()
      const [variantesRes, imagenesRes] = await Promise.all([
        sb.from('variantes').select('id, nombre, stock').eq('producto_id', rawProduct!.id).eq('activa', true).order('nombre'),
        sb.from('imagenes_producto').select('id, url, alt, orden').eq('producto_id', rawProduct!.id).order('orden'),
      ])

      const variantes: Variante[] = ((variantesRes.data ?? []) as { id: string; nombre: string; stock: number }[]).map(v => ({
        id: v.id,
        nombre: v.nombre,
        stock: v.stock,
      }))

      const imagenes = ((imagenesRes.data ?? []) as { id: string; url: string; alt?: string; orden: number }[]).map(img => ({
        id: img.id,
        url: img.url,
        alt: img.alt ?? undefined,
        orden: img.orden,
      }))

      setDetail({
        ...rawProduct!,
        descripcion: rawProduct!.descripcion_corta,
        material: rawProduct!.material ?? '',
        categoria: '',
        categoria_slug: '',
        variantes,
        imagenes,
      })
    }

    fetchDetail()
  }, [rawProduct])

  // ESC + lock scroll
  useEffect(() => {
    if (!detail) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [detail, onClose])

  if (!detail) return null

  const varianteSeleccionada = detail.variantes.find(v => v.nombre === variante)
  const stockActual = varianteSeleccionada?.stock ?? null
  const agotado = stockActual !== null && stockActual === 0
  const stockBajo = stockActual !== null && stockActual > 0 && stockActual <= STOCK_BAJO
  const wishlistOn = has(detail.id)

  function handleAdd() {
    if (!detail) return
    if (!variante && detail.variantes.length > 1) return
    const stock = varianteSeleccionada?.stock ?? detail.variantes[0]?.stock
    const ok = addItem(detail, variante ?? detail.variantes[0]?.nombre, stock)
    if (!ok) {
      setStockMsg(true)
      setTimeout(() => setStockMsg(false), 2500)
      return
    }
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  async function handleNotify(e: React.SyntheticEvent) {
    e.preventDefault()
    setNotifySent(true)
  }

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/producto/${detail.slug}`
    : ''
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`Mira esta joya: ${detail.nombre} — ${shareUrl}`)}`
  const instagramCaption = encodeURIComponent(`${detail.nombre} — ${detail.descripcion_corta}`)

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(20,40,30,0.55)',
          zIndex: 200,
          backdropFilter: 'blur(3px)',
        }}
      />

      {/* Lightbox */}
      <div className="modal-container">

        {/* Columna izquierda — carrusel */}
        {(() => {
          // Construir lista de imágenes: primero las de imagenes_producto, si no hay usar imagen_url
          const imgs: string[] = detail.imagenes && detail.imagenes.length > 0
            ? detail.imagenes.map(img => img.url)
            : (detail.imagen_url ? [detail.imagen_url] : [])
          const total = imgs.length
          const currentImg = imgs[imgIdx] ?? detail.imagen_url
          const currentAlt = (detail.imagenes?.[imgIdx]?.alt) ?? detail.imagen_alt ?? detail.nombre
          return (
            <div className="modal-image-col" style={{ position: 'relative', background: '#EDE5D4', minHeight: '420px', display: 'flex', flexDirection: 'column' }}>
              {/* Imagen principal */}
              <div style={{ flex: 1, position: 'relative' }}>
                {currentImg && (
                  <img
                    src={currentImg}
                    alt={currentAlt}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}

                {detail.badge && (
                  <div style={{
                    position: 'absolute', top: '16px', left: '16px',
                    background: detail.badge_variant === 'default' ? 'var(--verde)' : 'transparent',
                    color: detail.badge_variant === 'default' ? 'var(--crema)' : 'var(--verde)',
                    border: detail.badge_variant === 'outline' ? '0.5px solid rgba(28,61,46,0.25)' : 'none',
                    fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase',
                    padding: '5px 12px', fontFamily: 'var(--ff-sans)',
                  }}>
                    {detail.badge}
                  </div>
                )}

                {/* Flechas (solo si hay más de 1 imagen) */}
                {total > 1 && (
                  <>
                    <button
                      onClick={() => setImgIdx(i => (i - 1 + total) % total)}
                      style={{
                        position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)',
                        background: 'rgba(245,240,232,0.85)', border: 'none', cursor: 'pointer',
                        width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--verde)', fontSize: '18px', lineHeight: 1,
                      }}
                      aria-label="Imagen anterior"
                    >
                      ‹
                    </button>
                    <button
                      onClick={() => setImgIdx(i => (i + 1) % total)}
                      style={{
                        position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                        background: 'rgba(245,240,232,0.85)', border: 'none', cursor: 'pointer',
                        width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--verde)', fontSize: '18px', lineHeight: 1,
                      }}
                      aria-label="Imagen siguiente"
                    >
                      ›
                    </button>
                  </>
                )}

                <button
                  onClick={() => toggle(detail.id)}
                  style={{
                    position: 'absolute', bottom: '16px', right: '16px',
                    background: 'var(--crema)', border: '0.5px solid rgba(28,61,46,0.15)',
                    width: '38px', height: '38px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                  title={wishlistOn ? 'Quitar de favoritos' : 'Guardar en favoritos'}
                >
                  <HeartIcon filled={wishlistOn} />
                </button>
              </div>

              {/* Thumbnails (solo si hay más de 1 imagen) */}
              {total > 1 && (
                <div style={{ display: 'flex', gap: '6px', padding: '10px', background: '#EDE5D4', justifyContent: 'center', flexShrink: 0 }}>
                  {imgs.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => setImgIdx(i)}
                      style={{
                        width: '52px', height: '52px', padding: 0, border: 'none',
                        outline: i === imgIdx ? '2px solid var(--verde)' : '1px solid rgba(28,61,46,0.15)',
                        cursor: 'pointer', overflow: 'hidden', flexShrink: 0,
                        opacity: i === imgIdx ? 1 : 0.65,
                        transition: 'opacity 0.15s, outline 0.15s',
                      }}
                      aria-label={`Ver imagen ${i + 1}`}
                    >
                      <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })()}

        {/* Columna derecha — info con scroll */}
        <div className="modal-info-col" style={{
          overflowY: 'auto',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
          padding: '28px 32px 32px',
          position: 'relative',
        }}>

          {/* Botón cerrar */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: '16px', right: '20px',
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '22px', color: 'rgba(28,61,46,0.4)',
              lineHeight: 1, padding: '4px',
            }}
            aria-label="Cerrar"
          >
            ×
          </button>

          {/* Categoría */}
          {detail.categoria && (
            <div style={{
              fontSize: '9px', letterSpacing: '0.28em',
              textTransform: 'uppercase', color: 'var(--dorado)',
            }}>
              {detail.categoria}
            </div>
          )}

          {/* Nombre y precio */}
          <div>
            <h2 style={{
              fontFamily: 'var(--ff-serif)', fontSize: '28px', fontWeight: 300,
              color: 'var(--verde)', marginBottom: '8px', lineHeight: 1.1,
            }}>
              {detail.nombre}
            </h2>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
              <span style={{ fontFamily: 'var(--ff-serif)', fontSize: '24px', color: 'var(--dorado)' }}>
                {formatPrice(detail.precio)}
              </span>
              {detail.precio_comparar && (
                <span style={{
                  fontFamily: 'var(--ff-serif)', fontSize: '16px',
                  color: '#3a6b52', textDecoration: 'line-through', opacity: 0.5,
                }}>
                  {formatPrice(detail.precio_comparar)}
                </span>
              )}
            </div>
          </div>

          {/* Descripción */}
          <p style={{ fontSize: '13px', color: '#3a6b52', lineHeight: 1.85, margin: 0 }}>
            {detail.descripcion}
          </p>

          {/* Material */}
          {detail.material && (
            <p style={{
              fontSize: '10px', letterSpacing: '0.14em', color: '#3a6b52',
              textTransform: 'uppercase',
              borderTop: '0.5px solid rgba(28,61,46,0.08)', paddingTop: '14px',
              margin: 0,
            }}>
              {detail.material}
            </p>
          )}

          {/* Selector de talla */}
          {detail.variantes.length > 0 && (
            <div>
              <div style={{
                fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase',
                color: '#3a6b52', marginBottom: '10px',
              }}>
                Talla
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[...detail.variantes].sort((a, b) => {
                  const ORDER = ['S', 'M', 'L', 'XL', 'Única']
                  const rank = (nombre: string) => {
                    const prefix = ORDER.find(p => nombre.startsWith(p))
                    return prefix ? ORDER.indexOf(prefix) : 99
                  }
                  return rank(a.nombre) - rank(b.nombre)
                }).map(v => {
                  const sel = variante === v.nombre
                  const out = v.stock === 0
                  return (
                    <button
                      key={v.id}
                      onClick={() => !out && setVariante(v.nombre)}
                      style={{
                        padding: '8px 14px', cursor: out ? 'not-allowed' : 'pointer',
                        border: sel ? '0.5px solid var(--verde)' : '0.5px solid rgba(28,61,46,0.2)',
                        background: sel ? 'var(--verde)' : 'transparent',
                        color: sel ? 'var(--crema)' : out ? 'rgba(28,61,46,0.3)' : 'var(--verde)',
                        fontSize: '11px', letterSpacing: '0.08em',
                        textDecoration: out ? 'line-through' : 'none',
                        fontFamily: 'var(--ff-sans)',
                        transition: 'all 0.15s',
                      }}
                    >
                      {v.nombre}
                    </button>
                  )
                })}
              </div>
              {stockBajo && (
                <p style={{ marginTop: '8px', fontSize: '10px', color: '#C0392B', letterSpacing: '0.08em' }}>
                  Últimas {stockActual} unidades
                </p>
              )}
              <div style={{ marginTop: '10px' }}>
                <BotonGuiaTallas />
              </div>
            </div>
          )}

          {/* Botón agregar / avísame */}
          {agotado ? (
            notifySent ? (
              <p style={{ fontSize: '12px', color: 'var(--verde)', lineHeight: 1.7 }}>
                Te avisamos cuando vuelva a estar disponible.
              </p>
            ) : (
              <form onSubmit={handleNotify} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <p style={{ fontSize: '11px', color: '#3a6b52' }}>Producto agotado — déjanos tu email:</p>
                <div style={{ display: 'flex' }}>
                  <input
                    className="checkout-input"
                    type="email"
                    value={notifyEmail}
                    onChange={e => setNotifyEmail(e.target.value)}
                    placeholder="tu@correo.cl"
                    style={{ borderRight: 'none', flex: 1 }}
                    required
                  />
                  <button type="submit" style={{
                    background: 'var(--verde)', color: 'var(--crema)', border: 'none',
                    padding: '0 18px', fontSize: '10px', letterSpacing: '0.18em',
                    textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'var(--ff-sans)',
                  }}>
                    Avísame
                  </button>
                </div>
              </form>
            )
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={handleAdd}
                disabled={detail.variantes.length > 1 && !variante}
                style={{
                  background: added ? 'var(--verde-mid)' : 'var(--verde)',
                  color: 'var(--crema)', border: 'none', padding: '15px',
                  fontFamily: 'var(--ff-sans)', fontSize: '10px', letterSpacing: '0.28em',
                  textTransform: 'uppercase', cursor: 'pointer',
                  opacity: (detail.variantes.length > 1 && !variante) ? 0.5 : 1,
                  transition: 'all 0.2s',
                }}
              >
                {added ? '✓ Agregado al carrito' : '+ Agregar al carrito'}
              </button>
              {stockMsg && (
                <p style={{ margin: 0, fontSize: '11px', color: '#C0392B', letterSpacing: '0.06em' }}>
                  Stock máximo alcanzado
                </p>
              )}
            </div>
          )}

          {/* Compartir */}
          <div style={{
            display: 'flex', gap: '10px', alignItems: 'center',
            borderTop: '0.5px solid rgba(28,61,46,0.08)', paddingTop: '14px',
          }}>
            <span style={{ fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#3a6b52' }}>
              Compartir
            </span>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" style={{
              fontSize: '10px', letterSpacing: '0.14em', color: 'var(--verde)',
              textDecoration: 'none', border: '0.5px solid rgba(28,61,46,0.2)',
              padding: '6px 14px', textTransform: 'uppercase',
            }}>
              WhatsApp
            </a>
            <a href={`https://www.instagram.com/share?url=${encodeURIComponent(shareUrl)}&caption=${instagramCaption}`}
              target="_blank" rel="noopener noreferrer" style={{
              fontSize: '10px', letterSpacing: '0.14em', color: 'var(--verde)',
              textDecoration: 'none', border: '0.5px solid rgba(28,61,46,0.2)',
              padding: '6px 14px', textTransform: 'uppercase',
            }}>
              Instagram
            </a>
          </div>

        </div>
      </div>
    </>
  )
}