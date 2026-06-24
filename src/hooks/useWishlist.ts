'use client'

import { createContext, createElement, useContext, useEffect, useState, type ReactNode } from 'react'

interface WishlistStore {
  ids: string[]
  toggle: (id: string) => void
  has: (id: string) => boolean
}

const WishlistContext = createContext<WishlistStore | null>(null)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('mantis-wishlist')
      if (saved) setIds(JSON.parse(saved))
    } catch {}
  }, [])

  useEffect(() => {
    localStorage.setItem('mantis-wishlist', JSON.stringify(ids))
  }, [ids])

  function toggle(id: string) {
    setIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  return createElement(WishlistContext.Provider, {
    value: { ids, toggle, has: (id) => ids.includes(id) },
  }, children)
}

export function useWishlist(): WishlistStore {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist debe usarse dentro de <WishlistProvider>')
  return ctx
}
