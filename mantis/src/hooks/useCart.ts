'use client'

import { createContext, createElement, useContext, useEffect, useState, type ReactNode } from 'react'
import type { CartItem, Product } from '@/types'

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  totalItems: number
  totalPrice: number
  addItem: (product: Product, variante?: string) => void
  removeItem: (productId: string, variante?: string) => void
  updateQuantity: (productId: string, variante: string | undefined, cantidad: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartStore | null>(null)

// Clave única para identificar un ítem (producto + variante)
function itemKey(productId: string, variante?: string) {
  return productId + '||' + (variante ?? '')
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  // Hidratación desde localStorage (solo en cliente)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('mantis-cart')
      if (saved) setItems(JSON.parse(saved))
    } catch {}
  }, [])

  // Persistencia en localStorage cada vez que el carrito cambia
  useEffect(() => {
    localStorage.setItem('mantis-cart', JSON.stringify(items))
  }, [items])

  function addItem(product: Product, variante?: string) {
    setItems(prev => {
      const k = itemKey(product.id, variante)
      const exists = prev.find(i => itemKey(i.product.id, i.variante) === k)
      return exists
        ? prev.map(i => itemKey(i.product.id, i.variante) === k ? { ...i, cantidad: i.cantidad + 1 } : i)
        : [...prev, { product, variante, cantidad: 1 }]
    })
    setIsOpen(true) // abre el drawer al agregar
  }

  function removeItem(productId: string, variante?: string) {
    setItems(prev => prev.filter(i => itemKey(i.product.id, i.variante) !== itemKey(productId, variante)))
  }

  function updateQuantity(productId: string, variante: string | undefined, cantidad: number) {
    if (cantidad <= 0) return removeItem(productId, variante)
    setItems(prev => prev.map(i =>
      itemKey(i.product.id, i.variante) === itemKey(productId, variante) ? { ...i, cantidad } : i
    ))
  }

  function clearCart() {
    setItems([])
  }

  const totalItems = items.reduce((sum, i) => sum + i.cantidad, 0)
  const totalPrice = items.reduce((sum, i) => sum + i.product.precio * i.cantidad, 0)

  return createElement(CartContext.Provider, {
    value: {
      items, isOpen, totalItems, totalPrice,
      addItem, removeItem, updateQuantity, clearCart,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
    },
  }, children)
}

export function useCartStore(): CartStore {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCartStore debe usarse dentro de <CartProvider>')
  return ctx
}
