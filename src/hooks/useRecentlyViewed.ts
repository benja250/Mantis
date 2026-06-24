'use client'

import { createContext, createElement, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Product } from '@/types'

const MAX = 3

interface RecentlyViewedStore {
  products: Product[]
  track: (product: Product) => void
}

const RecentlyViewedContext = createContext<RecentlyViewedStore | null>(null)

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('mantis-recent')
      if (saved) setProducts(JSON.parse(saved))
    } catch {}
  }, [])

  useEffect(() => {
    localStorage.setItem('mantis-recent', JSON.stringify(products))
  }, [products])

  function track(product: Product) {
    setProducts(prev => {
      const without = prev.filter(p => p.id !== product.id)
      return [product, ...without].slice(0, MAX)
    })
  }

  return createElement(RecentlyViewedContext.Provider, { value: { products, track } }, children)
}

export function useRecentlyViewed(): RecentlyViewedStore {
  const ctx = useContext(RecentlyViewedContext)
  if (!ctx) throw new Error('useRecentlyViewed debe usarse dentro de <RecentlyViewedProvider>')
  return ctx
}
