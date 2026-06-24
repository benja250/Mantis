'use client'

import { useState } from 'react'
import Link from 'next/link'
import ProductCard from '@/components/productos/ProductCard'
import ProductModal from '@/components/productos/ProductModal'
import { PRODUCTOS_MOCK } from '@/lib/productos-mock'
import type { Product } from '@/types'

const DESTACADOS = ['pulsera-charm-dorada', 'pulsera-snake-fina', 'pulsera-eslabones']

export default function ProductosDestacados() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const products = DESTACADOS.map(slug => PRODUCTOS_MOCK[slug]).filter(Boolean)

  return (
    <section>
      {/* Encabezado */}
      <div className="products-header" style={{
        padding: '60px 48px 36px',
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
      }}>
        <h2 className="products-header-title" style={{
          fontFamily: 'var(--ff-serif)', fontSize: '42px', fontWeight: 300, color: 'var(--verde)',
        }}>
          Colección <em style={{ color: 'var(--dorado)', fontStyle: 'italic' }}>destacada</em>
        </h2>
        <Link href="/pulseras" className="see-all" style={{
          fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase',
          color: 'var(--dorado)', opacity: 0.7, cursor: 'pointer',
          transition: 'opacity 0.2s', textDecoration: 'none',
        }}>
          Ver todo →
        </Link>
      </div>

      {/* Grid */}
      <div className="products-grid products-featured-wrap">
        {products.map(p => {
          const minStock = Math.min(...p.variantes.map(v => v.stock))
          return (
            <ProductCard
              key={p.id}
              product={p}
              stock={minStock}
              onOpenModal={(p) => setSelectedProduct(p)}
            />
          )
        })}
      </div>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </section>
  )
}
