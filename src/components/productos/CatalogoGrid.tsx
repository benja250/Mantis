'use client'

import { useState } from 'react'
import ProductCard from './ProductCard'
import ProductModal from './ProductModal'
import type { Product } from '@/types'

export default function CatalogoGrid({ products }: { products: Product[] }) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

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
      </div>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </>
  )
}