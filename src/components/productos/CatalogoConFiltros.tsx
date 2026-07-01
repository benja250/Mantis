'use client'

import { useState, useMemo } from 'react'
import type { Product } from '@/types'
import CatalogoGrid from './CatalogoGrid'

interface Props {
  products: Product[]
}

type Orden = 'default' | 'precio-asc' | 'precio-desc'

export default function CatalogoConFiltros({ products }: Props) {
  const [orden, setOrden] = useState<Orden>('default')
  const [badgeFiltro, setBadgeFiltro] = useState<string | null>(null)

  const badges = useMemo(() => {
    const set = new Set<string>()
    for (const p of products) {
      if (p.badge) set.add(p.badge)
    }
    return Array.from(set)
  }, [products])

  const filtrados = useMemo(() => {
    let lista = badgeFiltro
      ? products.filter(p => p.badge === badgeFiltro)
      : [...products]

    if (orden === 'precio-asc') lista.sort((a, b) => a.precio - b.precio)
    else if (orden === 'precio-desc') lista.sort((a, b) => b.precio - a.precio)

    return lista
  }, [products, orden, badgeFiltro])

  const hayFiltros = badges.length > 0

  return (
    <>
      {/* Barra de filtros */}
      <div style={{
        padding: '16px 48px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap',
        borderBottom: '0.5px solid rgba(28,61,46,0.06)',
        background: 'var(--crema)',
      }}>
        {/* Ordenar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '8px' }}>
          <span style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#3a6b52', opacity: 0.7 }}>
            Ordenar
          </span>
          <select
            value={orden}
            onChange={e => setOrden(e.target.value as Orden)}
            style={{
              background: 'none',
              border: '0.5px solid rgba(28,61,46,0.2)',
              padding: '5px 10px',
              fontFamily: 'var(--ff-sans)',
              fontSize: '11px',
              color: 'var(--verde)',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="default">Destacados</option>
            <option value="precio-asc">Precio: menor a mayor</option>
            <option value="precio-desc">Precio: mayor a menor</option>
          </select>
        </div>

        {/* Filtro por badge */}
        {hayFiltros && (
          <>
            <div style={{ width: '0.5px', height: '20px', background: 'rgba(28,61,46,0.12)' }} />
            <span style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#3a6b52', opacity: 0.7 }}>
              Filtrar
            </span>
            <button
              onClick={() => setBadgeFiltro(null)}
              style={{
                border: badgeFiltro === null ? '0.5px solid var(--dorado)' : '0.5px solid rgba(28,61,46,0.15)',
                background: badgeFiltro === null ? 'rgba(160,120,48,0.08)' : 'none',
                padding: '5px 14px',
                fontFamily: 'var(--ff-sans)',
                fontSize: '10px',
                letterSpacing: '0.1em',
                cursor: 'pointer',
                color: badgeFiltro === null ? 'var(--dorado)' : 'var(--verde)',
                transition: 'all 0.15s',
              }}
            >
              Todos
            </button>
            {badges.map(b => (
              <button
                key={b}
                onClick={() => setBadgeFiltro(b === badgeFiltro ? null : b)}
                style={{
                  border: badgeFiltro === b ? '0.5px solid var(--dorado)' : '0.5px solid rgba(28,61,46,0.15)',
                  background: badgeFiltro === b ? 'rgba(160,120,48,0.08)' : 'none',
                  padding: '5px 14px',
                  fontFamily: 'var(--ff-sans)',
                  fontSize: '10px',
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  color: badgeFiltro === b ? 'var(--dorado)' : 'var(--verde)',
                  transition: 'all 0.15s',
                }}
              >
                {b}
              </button>
            ))}
          </>
        )}

        <span style={{ fontSize: '11px', color: '#3a6b52', opacity: 0.5 }}>
          {filtrados.length} {filtrados.length === 1 ? 'producto' : 'productos'}
        </span>
      </div>

      <CatalogoGrid products={filtrados} />
    </>
  )
}
