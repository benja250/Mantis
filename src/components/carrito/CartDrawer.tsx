'use client'

import Link from 'next/link'
import { useCartStore } from '@/hooks/useCart'
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed'
import { formatPrice } from '@/lib/format'

const qBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  width: '28px',
  height: '28px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '16px',
  color: 'var(--verde)',
  lineHeight: 1,
}

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalItems, totalPrice, addItem } = useCartStore()
  const { products: recentProducts } = useRecentlyViewed()

  return (
    <>
      {/* Overlay */}
      <div
        onClick={closeCart}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.35)',
          zIndex: 200,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'all' : 'none',
          transition: 'opacity 0.3s',
        }}
      />

      {/* Panel */}
      <div className="cart-panel" style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        background: 'var(--crema)',
        zIndex: 201,
        display: 'flex',
        flexDirection: 'column',
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s ease',
        borderLeft: '0.5px solid rgba(28,61,46,0.1)',
      }}>

        {/* Cabecera */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '28px 32px',
          borderBottom: '0.5px solid rgba(28,61,46,0.1)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <span style={{
              fontFamily: 'var(--ff-serif)',
              fontSize: '22px',
              fontWeight: 400,
              color: 'var(--verde)',
              letterSpacing: '0.1em',
            }}>
              Carrito
            </span>
            {totalItems > 0 && (
              <span style={{
                fontSize: '11px',
                color: 'var(--dorado)',
                letterSpacing: '0.08em',
              }}>
                ({totalItems} {totalItems === 1 ? 'producto' : 'productos'})
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            aria-label="Cerrar carrito"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--verde)',
              fontSize: '22px',
              lineHeight: 1,
              padding: '4px',
              opacity: 0.6,
            }}
          >
            ×
          </button>
        </div>

        {/* Vacío */}
        {items.length === 0 && (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            padding: '32px',
          }}>
            <div style={{
              fontFamily: 'var(--ff-serif)',
              fontSize: '20px',
              fontWeight: 300,
              color: 'var(--verde)',
              opacity: 0.4,
            }}>
              Tu carrito está vacío
            </div>
            <Link
              href="/pulseras"
              onClick={closeCart}
              style={{
                fontSize: '10px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--dorado)',
                textDecoration: 'none',
              }}
            >
              Ver colección →
            </Link>
          </div>
        )}

        {/* Lista de ítems */}
        {items.length > 0 && (
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {items.map(({ product, variante, cantidad, maxStock, desglose }) => {
              const key = product.id + '||' + (variante ?? '')
              return (
                <div
                  key={key}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '64px 1fr',
                    gap: '16px',
                    padding: '20px 32px',
                    borderBottom: '0.5px solid rgba(28,61,46,0.07)',
                    alignItems: 'start',
                  }}
                >
                  {/* Imagen */}
                  <div style={{
                    width: '64px',
                    height: '64px',
                    background: 'var(--crema-dark)',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}>
                    {product.imagen_url && (
                      <img
                        src={product.imagen_url}
                        alt={product.nombre}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    )}
                  </div>

                  <div>
                    <div style={{
                      fontFamily: 'var(--ff-serif)',
                      fontSize: '17px',
                      color: 'var(--verde)',
                      marginBottom: '4px',
                    }}>
                      {product.nombre}
                    </div>

                    {/* Desglose pulsera personalizada */}
                    {desglose ? (
                      <div style={{ marginBottom: '10px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#3a6b52', letterSpacing: '0.06em' }}>
                          <span>{desglose.cadena.nombre}</span>
                          <span>{formatPrice(desglose.cadena.precio)}</span>
                        </div>
                        {desglose.dijes.map((d, i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#3a6b52', letterSpacing: '0.06em' }}>
                            <span>{d.nombre}</span>
                            <span>{formatPrice(d.precio)}</span>
                          </div>
                        ))}
                      </div>
                    ) : variante && (
                      <div style={{
                        fontSize: '10px',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: '#3a6b52',
                        marginBottom: '10px',
                      }}>
                        {variante}
                      </div>
                    )}

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: (desglose || variante) ? 0 : '10px',
                    }}>
                      {/* Controles cantidad */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '0.5px solid rgba(28,61,46,0.2)',
                      }}>
                        <button
                          style={qBtnStyle}
                          onClick={() => updateQuantity(product.id, variante, cantidad - 1)}
                          aria-label="Reducir"
                        >
                          −
                        </button>
                        <span style={{
                          width: '32px',
                          textAlign: 'center',
                          fontSize: '12px',
                          color: 'var(--verde)',
                          fontFamily: 'var(--ff-sans)',
                        }}>
                          {cantidad}
                        </span>
                        <button
                          style={{ ...qBtnStyle, opacity: (maxStock != null && cantidad >= maxStock) ? 0.3 : 1 }}
                          onClick={() => updateQuantity(product.id, variante, cantidad + 1)}
                          disabled={maxStock != null && cantidad >= maxStock}
                          aria-label="Aumentar"
                        >
                          +
                        </button>
                      </div>

                      <span style={{
                        fontFamily: 'var(--ff-serif)',
                        fontSize: '18px',
                        color: 'var(--dorado)',
                      }}>
                        {formatPrice(product.precio * cantidad)}
                      </span>
                    </div>

                    <button
                      onClick={() => removeItem(product.id, variante)}
                      style={{
                        marginTop: '8px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '9px',
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        color: '#3a6b52',
                        padding: 0,
                        opacity: 0.6,
                        fontFamily: 'var(--ff-sans)',
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Visto recientemente */}
        {recentProducts.length > 0 && (
          <div style={{
            borderTop: '0.5px solid rgba(28,61,46,0.08)',
            padding: '20px 32px',
            flexShrink: 0,
          }}>
            <div style={{
              fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase',
              color: '#3a6b52', marginBottom: '14px',
            }}>
              Visto recientemente
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {recentProducts.map(p => (
                <div key={p.id} style={{
                  display: 'flex', gap: '12px', alignItems: 'center',
                }}>
                  <div style={{ width: '40px', height: '40px', background: 'var(--crema-dark)', flexShrink: 0, overflow: 'hidden' }}>
                    {p.imagen_url && (
                      <img src={p.imagen_url} alt={p.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '12px', color: 'var(--verde)', marginBottom: '2px' }}>{p.nombre}</p>
                    <p style={{ fontSize: '11px', color: 'var(--dorado)' }}>{formatPrice(p.precio)}</p>
                  </div>
                  <button
                    onClick={() => addItem(p)}
                    style={{
                      background: 'none', border: '0.5px solid rgba(28,61,46,0.2)',
                      color: 'var(--verde)', padding: '5px 10px', cursor: 'pointer',
                      fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase',
                      fontFamily: 'var(--ff-sans)',
                    }}
                  >
                    + Agregar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pie: total + checkout */}
        {items.length > 0 && (
          <div style={{
            borderTop: '0.5px solid rgba(28,61,46,0.1)',
            padding: '24px 32px',
            flexShrink: 0,
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              marginBottom: '20px',
            }}>
              <span style={{
                fontSize: '10px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#3a6b52',
              }}>
                Total
              </span>
              <span style={{
                fontFamily: 'var(--ff-serif)',
                fontSize: '28px',
                fontWeight: 300,
                color: 'var(--verde)',
              }}>
                {formatPrice(totalPrice)}
              </span>
            </div>

            <Link
              href="/checkout"
              onClick={closeCart}
              style={{
                display: 'block',
                background: 'var(--verde)',
                color: 'var(--crema)',
                padding: '15px',
                textAlign: 'center',
                fontFamily: 'var(--ff-sans)',
                fontSize: '10px',
                letterSpacing: '0.26em',
                textTransform: 'uppercase',
                textDecoration: 'none',
              }}
            >
              Ir al checkout →
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
