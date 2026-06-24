'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/hooks/useCart'

const NAV_LINKS = [
  { href: '/pulseras',      label: 'Pulseras' },
  { href: '/collares',      label: 'Collares' },
  { href: '/crear-pulsera', label: 'Crea tu pulsera' },
  { href: '/nosotros',      label: 'Nosotros' },
  { href: '/cuidados',      label: 'Cuidados' },
  { href: '/despacho',      label: 'Despacho' },
  { href: '/faq',           label: 'FAQ' },
]

export default function Nav() {
  const { totalItems, openCart } = useCartStore()

  return (
    <nav
      className="sticky top-0 z-[100] flex items-center justify-between bg-crema"
      style={{ padding: '18px 48px', borderBottom: '0.5px solid rgba(28,61,46,0.12)' }}
    >

      {/* Logo */}
      <Link href="/" className="flex items-center gap-[10px] no-underline">
        <Image src="/logo.png" alt="Mantis" width={38} height={43} />
        <div>
          <div className="font-serif text-[26px] font-semibold text-verde tracking-[0.14em] leading-none">
            MANTIS
          </div>
          <span className="text-[9px] font-light block tracking-[0.32em] text-dorado mt-px uppercase">
            Joyas bañadas en oro
          </span>
        </div>
      </Link>

      {/* Links */}
      <div className="flex gap-6">
        {NAV_LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="text-[10px] tracking-[0.18em] text-verde-light no-underline uppercase transition-colors duration-200 hover:text-verde"
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Acciones */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Wishlist */}
        <Link
          href="/wishlist"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'none', border: 'none', cursor: 'pointer',
            width: '36px', height: '36px',
          }}
          title="Favoritos"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 21C12 21 3 14 3 8a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6-9 13-9 13z"
              stroke="rgba(28,61,46,0.5)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>

        {/* Carrito */}
        <button
          onClick={openCart}
          style={{
            background: '#1C3D2E',
            color: '#F5F0E8',
            border: 'none',
            padding: '10px 20px',
            fontSize: '10px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            fontFamily: 'var(--ff-sans)',
            transition: 'opacity 0.2s',
          }}
        >
          Carrito{' '}
          <span style={{ color: '#C8A96E', marginLeft: '4px' }}>({totalItems})</span>
        </button>
      </div>
    </nav>
  )
}
