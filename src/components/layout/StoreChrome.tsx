'use client'

import { usePathname } from 'next/navigation'
import Nav from './Nav'
import Footer from './Footer'
import CartDrawer from '@/components/carrito/CartDrawer'

export default function StoreChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (pathname.startsWith('/admin')) return <>{children}</>
  return (
    <>
      <Nav />
      {children}
      <Footer />
      <CartDrawer />
    </>
  )
}
