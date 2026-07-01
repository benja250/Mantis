'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useWishlist } from '@/hooks/useWishlist'
import { createClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/format'
import type { Product } from '@/types'

export default function WishlistPage() {
  const { ids, toggle } = useWishlist()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (ids.length === 0) {
      setProducts([])
      setLoading(false)
      return
    }

    async function fetchWishlist() {
      setLoading(true)
      const sb = createClient()
      const { data } = await sb
        .from('productos')
        .select('id, slug, nombre, descripcion_corta, precio, precio_comparar, badge, material, imagen_url, imagenes_producto(url, alt, es_principal)')
        .in('id', ids)
        .eq('activo', true)

      type ImagenRow = { url: string; alt: string | null; es_principal: boolean }
      const mapped: Product[] = (data ?? []).map(p => {
        const imgs = (p.imagenes_producto ?? []) as ImagenRow[]
        const img = imgs.find(i => i.es_principal) ?? imgs[0]
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const directUrl = (p as any).imagen_url as string | null | undefined
        return {
          id: p.id,
          slug: p.slug,
          nombre: p.nombre,
          descripcion_corta: p.descripcion_corta,
          precio: p.precio,
          precio_comparar: p.precio_comparar ?? undefined,
          badge: p.badge ?? undefined,
          material: p.material ?? undefined,
          imagen_url: img?.url ?? directUrl ?? undefined,
          imagen_alt: img?.alt ?? undefined,
        }
      })
      setProducts(mapped)
      setLoading(false)
    }

    fetchWishlist()
  }, [ids.join(',')])

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
          Favoritos
        </div>
        <h1 style={{
          fontFamily: 'var(--ff-serif)', fontSize: '52px', fontWeight: 300, color: 'var(--verde)',
        }}>
          Tu lista de<br />
          <em style={{ color: 'var(--dorado)', fontStyle: 'italic' }}>deseos</em>
        </h1>
      </div>

      <div style={{ padding: '56px 48px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', fontSize: '13px', color: '#3a6b52' }}>
            Cargando...
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{
              fontFamily: 'var(--ff-serif)', fontSize: '22px', color: 'var(--verde)', marginBottom: '20px',
            }}>
              Aún no tienes favoritos guardados
            </p>
            <Link href="/pulseras" style={{
              fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase',
              color: 'var(--dorado)', textDecoration: 'none',
            }}>
              Explorar colección →
            </Link>
          </div>
        ) : (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1px', background: 'rgba(28,61,46,0.08)',
          }}>
            {products.map(p => (
              <div key={p.id} style={{ background: 'var(--crema)', position: 'relative' }}>
                <div style={{
                  aspectRatio: '1', background: 'var(--crema)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative', overflow: 'hidden',
                }}>
                  {p.imagen_url ? (
                    <img
                      src={p.imagen_url}
                      alt={p.imagen_alt ?? p.nombre}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <svg width="48" height="48" viewBox="0 0 80 80" style={{ opacity: 0.15 }}>
                      <ellipse cx="40" cy="40" rx="6" ry="8" fill="none" stroke="#A07830" strokeWidth="1.5" />
                      <path d="M37 33 Q28 22 18 14" fill="none" stroke="#A07830" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M43 33 Q52 22 62 14" fill="none" stroke="#A07830" strokeWidth="1.5" strokeLinecap="round" />
                      <polygon points="40,26 35,33 45,33" fill="none" stroke="#A07830" strokeWidth="1.5" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>

                <button
                  onClick={() => toggle(p.id)}
                  style={{
                    position: 'absolute', top: '14px', right: '14px',
                    background: 'var(--crema)', border: '0.5px solid rgba(28,61,46,0.15)',
                    width: '32px', height: '32px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                  title="Quitar de favoritos"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24">
                    <path
                      d="M12 21C12 21 3 14 3 8a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6-9 13-9 13z"
                      fill="#C0392B" stroke="#C0392B" strokeWidth="1.5"
                    />
                  </svg>
                </button>

                <div style={{ padding: '22px 24px' }}>
                  <p style={{
                    fontFamily: 'var(--ff-serif)', fontSize: '20px',
                    color: 'var(--verde)', marginBottom: '4px',
                  }}>
                    {p.nombre}
                  </p>
                  <p style={{ fontSize: '11px', color: '#3a6b52', marginBottom: '16px', lineHeight: 1.6 }}>
                    {p.descripcion_corta}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'var(--ff-serif)', fontSize: '20px', color: 'var(--dorado)' }}>
                      {formatPrice(p.precio)}
                    </span>
                    <Link href={`/producto/${p.slug}`} style={{
                      fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase',
                      color: 'var(--verde)', textDecoration: 'none',
                      border: '0.5px solid rgba(28,61,46,0.25)',
                      padding: '8px 16px',
                    }}>
                      Ver →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
