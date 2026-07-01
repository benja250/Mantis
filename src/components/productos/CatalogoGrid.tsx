'use client'

import { useState } from 'react'
import ProductCard from './ProductCard'
import ProductModal from './ProductModal'
import type { Product } from '@/types'

export default function CatalogoGrid({ products }: { products: Product[] }) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const rem = products.length % 3
  const fillers = rem === 0 ? 0 : 3 - rem

  return (
    <>
      <div className="products-grid products-catalog-wrap">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onOpenModal={(p) => setSelectedProduct(p)}
          />
        ))}
        {Array.from({ length: fillers }).map((_, i) => (
          <div key={`filler-${i}`} style={{ background: 'var(--crema)' }} />
        ))}
      </div>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </>
  )
}