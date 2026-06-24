'use client'

import { useState } from 'react'
import ProductCard from './ProductCard'
import ProductModal from './ProductModal'
import type { Product } from '@/types'

export default function CatalogoGrid({ products }: { products: Product[] }) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  return (
    <>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1px',
        background: 'rgba(28,61,46,0.08)',
        margin: '0 48px 80px',
      }}>
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onOpenModal={(p) => setSelectedProduct(p)}
          />
        ))}
      </div>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </>
  )
}