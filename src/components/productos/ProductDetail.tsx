'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/hooks/useCart'
import { formatPrice } from '@/lib/format'
import type { ProductDetail } from '@/types'

const TRUST = [
  { label: 'Baño oro 18k' },
  { label: 'Envío a todo Chile' },
  { label: '48h para reportar defectos' },
]

function ImagenProducto({ badge, badge_variant }: { badge?: string; badge_variant?: 'default' | 'outline' }) {
  return (
    <div style={{
      background: 'var(--crema-dark)',
      aspectRatio: '1',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    }}>
      {badge && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          background: badge_variant === 'outline' ? 'transparent' : 'var(--verde)',
          color: badge_variant === 'outline' ? 'var(--verde)' : 'var(--crema)',
          border: badge_variant === 'outline' ? '0.5px solid rgba(28,61,46,0.25)' : 'none',
          fontSize: '9px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          padding: '6px 14px',
          fontFamily: 'var(--ff-sans)',
          fontWeight: 400,
        }}>
          {badge}
        </div>
      )}
      {/* Watermark */}
      <svg width="120" height="120" viewBox="0 0 80 80" aria-hidden style={{ opacity: 0.08 }}>
        <path d="M40 52 L34 64 L40 68 L46 64 Z" fill="none" stroke="#A07830" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M36 44 L32 52 L34 64 L40 68 L46 64 L48 52 L44 44 Z" fill="none" stroke="#A07830" strokeWidth="1.5" strokeLinejoin="round" />
        <ellipse cx="40" cy="40" rx="6" ry="8" fill="none" stroke="#A07830" strokeWidth="1.5" />
        <path d="M37 33 Q28 22 18 14" fill="none" stroke="#A07830" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M36 34 Q24 26 16 22" fill="none" stroke="#A07830" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M43 33 Q52 22 62 14" fill="none" stroke="#A07830" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M44 34 Q56 26 64 22" fill="none" stroke="#A07830" strokeWidth="1.5" strokeLinecap="round" />
        <polygon points="40,26 35,33 45,33" fill="none" stroke="#A07830" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

export default function ProductDetail({ product }: { product: ProductDetail }) {
  const [varianteSeleccionada, setVarianteSeleccionada] = useState<string | null>(
    product.variantes.length === 1 ? product.variantes[0].id : null
  )
  const [error, setError] = useState(false)
  const { addItem } = useCartStore()

  function handleAgregar() {
    if (product.variantes.length > 1 && !varianteSeleccionada) {
      setError(true)
      return
    }
    const variante = product.variantes.find(v => v.id === varianteSeleccionada)
    addItem(product, variante?.nombre)
    setError(false)
  }

  return (
    <main>
      {/* Breadcrumb */}
      <div style={{
        padding: '20px 48px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '10px',
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: '#3a6b52',
        borderBottom: '0.5px solid rgba(28,61,46,0.08)',
      }}>
        <Link href="/" style={{ color: '#3a6b52', textDecoration: 'none' }}>Inicio</Link>
        <span style={{ opacity: 0.4 }}>›</span>
        <Link href={`/${product.categoria_slug}`} style={{ color: '#3a6b52', textDecoration: 'none' }}>
          {product.categoria}
        </Link>
        <span style={{ opacity: 0.4 }}>›</span>
        <span style={{ color: 'var(--verde)' }}>{product.nombre}</span>
      </div>

      {/* Layout 2 columnas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '55fr 45fr',
        minHeight: '600px',
      }}>
        {/* Columna imagen */}
        <ImagenProducto badge={product.badge} badge_variant={product.badge_variant} />

        {/* Columna info */}
        <div style={{
          padding: '56px 48px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          borderLeft: '0.5px solid rgba(28,61,46,0.08)',
        }}>
          {/* Tag categoría */}
          <div style={{
            fontSize: '9px',
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: 'var(--dorado)',
            marginBottom: '16px',
          }}>
            {product.categoria}
          </div>

          {/* Nombre */}
          <h1 style={{
            fontFamily: 'var(--ff-serif)',
            fontSize: '44px',
            fontWeight: 300,
            color: 'var(--verde)',
            lineHeight: 1.05,
            marginBottom: '20px',
          }}>
            {product.nombre}
          </h1>

          {/* Precio */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '28px' }}>
            <span style={{
              fontFamily: 'var(--ff-serif)',
              fontSize: '34px',
              color: 'var(--dorado)',
              lineHeight: 1,
            }}>
              {formatPrice(product.precio)}
            </span>
            {product.precio_comparar && (
              <span style={{
                fontFamily: 'var(--ff-serif)',
                fontSize: '20px',
                color: '#3a6b52',
                textDecoration: 'line-through',
                opacity: 0.5,
              }}>
                {formatPrice(product.precio_comparar)}
              </span>
            )}
          </div>

          <div style={{ height: '0.5px', background: 'rgba(28,61,46,0.1)', marginBottom: '28px' }} />

          {/* Material */}
          <div style={{
            fontSize: '11px',
            letterSpacing: '0.08em',
            color: '#3a6b52',
            marginBottom: '16px',
            lineHeight: 1.6,
          }}>
            {product.material}
          </div>

          {/* Descripción */}
          <p style={{
            fontSize: '13px',
            color: '#3a6b52',
            lineHeight: 1.85,
            marginBottom: '36px',
          }}>
            {product.descripcion}
          </p>

          {/* Selector de variante */}
          {product.variantes.length > 1 && (
            <div style={{ marginBottom: '28px' }}>
              <div style={{
                fontSize: '10px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: error ? '#C0392B' : 'var(--verde)',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                Talla
                {error && (
                  <span style={{ fontStyle: 'italic', letterSpacing: '0.04em', textTransform: 'none' }}>
                    — selecciona una opción
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {product.variantes.map(v => {
                  const seleccionada = varianteSeleccionada === v.id
                  const sinStock = v.stock === 0
                  return (
                    <button
                      key={v.id}
                      onClick={() => { setVarianteSeleccionada(v.id); setError(false) }}
                      disabled={sinStock}
                      style={{
                        padding: '10px 16px',
                        fontFamily: 'var(--ff-sans)',
                        fontSize: '11px',
                        letterSpacing: '0.08em',
                        cursor: sinStock ? 'not-allowed' : 'pointer',
                        transition: 'all 0.15s',
                        border: seleccionada
                          ? '0.5px solid var(--verde)'
                          : error
                            ? '0.5px solid rgba(192,57,43,0.5)'
                            : '0.5px solid rgba(28,61,46,0.25)',
                        background: seleccionada ? 'var(--verde)' : 'transparent',
                        color: seleccionada ? 'var(--crema)' : sinStock ? '#3a6b5260' : 'var(--verde)',
                        opacity: sinStock ? 0.4 : 1,
                        textDecoration: sinStock ? 'line-through' : 'none',
                      }}
                    >
                      {v.nombre}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Botón agregar */}
          <button
            onClick={handleAgregar}
            style={{
              background: 'var(--verde)',
              color: 'var(--crema)',
              border: 'none',
              padding: '16px',
              fontFamily: 'var(--ff-sans)',
              fontSize: '10px',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              marginBottom: '28px',
              transition: 'background 0.2s',
            }}
            className="producto-add-btn"
          >
            + Agregar al carrito
          </button>

          {/* Trust signals */}
          <div style={{
            display: 'flex',
            gap: '20px',
            paddingTop: '20px',
            borderTop: '0.5px solid rgba(28,61,46,0.08)',
          }}>
            {TRUST.map(({ label }) => (
              <div key={label} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '10px',
                letterSpacing: '0.06em',
                color: '#3a6b52',
              }}>
                <span style={{ color: 'var(--dorado)', fontSize: '12px' }}>✓</span>
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
