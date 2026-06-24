'use client'

import { Product } from '@/types'
import { formatPrice } from '@/lib/format'
import { useWishlist } from '@/hooks/useWishlist'
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed'

const STOCK_BAJO = 8

function PlaceholderSVG({ categoria }: { categoria?: string }) {
  if (categoria === 'collares') {
    return (
      <svg width="110" height="90" viewBox="0 0 110 90" fill="none">
        <path d="M12 18 Q55 72 98 18" stroke="#A07830" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M12 18 Q55 72 98 18" stroke="#C8A96E" strokeWidth="1" strokeLinecap="round" strokeDasharray="3 5" opacity="0.7"/>
        <line x1="55" y1="70" x2="55" y2="78" stroke="#A07830" strokeWidth="1.5"/>
        <circle cx="55" cy="78" r="3" fill="none" stroke="#A07830" strokeWidth="1.2"/>
        <path d="M49 84 Q49 80 52 80 Q55 80 55 84 Q55 80 58 80 Q61 80 61 84 Q61 89 55 94 Q49 89 49 84Z" fill="#A07830" opacity="0.75"/>
      </svg>
    )
  }
  return (
    <svg width="140" height="70" viewBox="0 0 140 70" fill="none">
      <path d="M14 35 Q70 35 126 35" stroke="#A07830" strokeWidth="6" strokeLinecap="round"/>
      <path d="M14 35 Q70 35 126 35" stroke="#C8A96E" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 6"/>
      <rect x="3" y="28" width="14" height="14" rx="4" fill="#A07830"/>
      <rect x="5" y="30" width="10" height="10" rx="3" fill="#1C3D2E" stroke="#A07830" strokeWidth="0.5"/>
      <circle cx="133" cy="35" r="7" fill="none" stroke="#A07830" strokeWidth="2"/>
      <circle cx="133" cy="35" r="3" fill="#A07830"/>
      <line x1="55" y1="38" x2="55" y2="50" stroke="#A07830" strokeWidth="1.5"/>
      <circle cx="55" cy="49" r="3" fill="none" stroke="#A07830" strokeWidth="1"/>
      <path d="M48 57 Q48 53 51 53 Q55 53 55 57 Q55 53 59 53 Q62 53 62 57 Q62 62 55 68 Q48 62 48 57Z" fill="#C0392B" opacity="0.85"/>
      <line x1="85" y1="38" x2="85" y2="50" stroke="#A07830" strokeWidth="1.5"/>
      <circle cx="85" cy="49" r="3" fill="none" stroke="#A07830" strokeWidth="1"/>
      <path d="M85 53 L87 59 L93 59 L88 63 L90 69 L85 65 L80 69 L82 63 L77 59 L83 59Z" fill="#A07830" opacity="0.8"/>
    </svg>
  )
}

const BADGE_STYLES: Record<'default' | 'outline', React.CSSProperties> = {
  default: { background: 'var(--verde)', color: 'var(--crema)', border: 'none' },
  outline: { background: 'transparent', color: 'var(--verde)', border: '0.5px solid rgba(28,61,46,0.25)' },
}

interface ProductCardProps {
  product: Product
  stock?: number
  onOpenModal?: (product: Product) => void
}

export default function ProductCard({ product, stock, onOpenModal }: ProductCardProps) {
  const { nombre, descripcion_corta, precio, precio_comparar, badge, badge_variant = 'default', imagen_url, imagen_alt, categoria_slug } = product
  const { has, toggle } = useWishlist()
  const { track } = useRecentlyViewed()

  const stockBajo = stock !== undefined && stock > 0 && stock <= STOCK_BAJO
  const wishOn = has(product.id)

  function handleOpen() {
    track(product)
    onOpenModal?.(product)
  }

  return (
    <div
      className="product-card"
      style={{ background: 'var(--crema)', cursor: 'pointer', transition: 'background 0.25s', position: 'relative' }}
      onClick={handleOpen}
    >
      {/* Imagen */}
      <div
        className="product-img"
        style={{
          width: '100%',
          aspectRatio: '1 / 1',
          background: '#EDE5D4',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {imagen_url ? (
          <img
            src={imagen_url}
            alt={imagen_alt ?? nombre}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <PlaceholderSVG categoria={categoria_slug} />
        )}

        {badge && (
          <div style={{
            position: 'absolute', top: '14px', left: '14px',
            fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase',
            padding: '5px 12px', fontFamily: 'var(--ff-sans)', fontWeight: 400,
            ...BADGE_STYLES[badge_variant],
          }}>
            {badge}
          </div>
        )}

        <button
          onClick={e => { e.stopPropagation(); toggle(product.id) }}
          style={{
            position: 'absolute', top: '14px', right: '14px',
            background: 'var(--crema)', border: '0.5px solid rgba(28,61,46,0.15)',
            width: '32px', height: '32px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1,
          }}
          title={wishOn ? 'Quitar de favoritos' : 'Guardar en favoritos'}
        >
          <svg width="14" height="14" viewBox="0 0 24 24">
            <path
              d="M12 21C12 21 3 14 3 8a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6-9 13-9 13z"
              fill={wishOn ? '#C0392B' : 'none'}
              stroke={wishOn ? '#C0392B' : 'rgba(28,61,46,0.4)'}
              strokeWidth="1.5"
            />
          </svg>
        </button>
      </div>

      {/* Info */}
      <div style={{ padding: '22px 24px' }}>
        <div style={{
          fontFamily: 'var(--ff-serif)', fontSize: '22px', fontWeight: 400,
          color: 'var(--verde)', marginBottom: '5px',
        }}>
          {nombre}
        </div>
        <div style={{ fontSize: '11px', letterSpacing: '0.06em', color: '#3a6b52', marginBottom: '8px', lineHeight: 1.6 }}>
          {descripcion_corta}
        </div>

        {stockBajo && (
          <p style={{
            fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase',
            color: '#C0392B', marginBottom: '12px',
          }}>
            Últimas {stock} unidades
          </p>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontFamily: 'var(--ff-serif)', fontSize: '22px', color: 'var(--dorado)' }}>
              {formatPrice(precio)}
            </span>
            {precio_comparar && (
              <span style={{
                fontFamily: 'var(--ff-serif)', fontSize: '15px',
                color: '#3a6b52', textDecoration: 'line-through', opacity: 0.6,
              }}>
                {formatPrice(precio_comparar)}
              </span>
            )}
          </div>
          <button
            className="add-btn"
            onClick={e => { e.stopPropagation(); handleOpen() }}
            style={{
              background: 'none', border: '0.5px solid rgba(28,61,46,0.25)',
              color: 'var(--verde)', padding: '8px 16px', fontSize: '10px',
              letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer',
              fontFamily: 'var(--ff-sans)', transition: 'all 0.2s',
            }}
          >
            + Agregar
          </button>
        </div>
      </div>
    </div>
  )
}
