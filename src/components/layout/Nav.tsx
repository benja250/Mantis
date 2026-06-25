'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/hooks/useCart'
import BuscadorOverlay from '@/components/busqueda/BuscadorOverlay'

const NAV_LINKS = [
  { href: '/pulseras',      label: 'Pulseras' },
  { href: '/collares',      label: 'Collares' },
  { href: '/crear-pulsera', label: 'Crea tu pulsera' },
  { href: '/nosotros',      label: 'Nosotros' },
  { href: '/cuidados',      label: 'Cuidados' },
  { href: '/despacho',      label: 'Despacho' },
  { href: '/faq',           label: 'FAQ' },
]

function HamburgerIcon() {
  return (
    <svg width="22" height="18" viewBox="0 0 22 18" fill="none">
      <line x1="0" y1="1" x2="22" y2="1" stroke="#1C3D2E" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="0" y1="9" x2="22" y2="9" stroke="#1C3D2E" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="0" y1="17" x2="22" y2="17" stroke="#1C3D2E" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <line x1="2" y1="2" x2="18" y2="18" stroke="#1C3D2E" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="18" y1="2" x2="2" y2="18" stroke="#1C3D2E" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export default function Nav() {
  const { totalItems, openCart } = useCartStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <>
      <nav
        className="sticky top-0 z-[100] bg-crema nav-bar"
        style={{ borderBottom: '0.5px solid rgba(28,61,46,0.12)' }}
      >
        {/* Hamburger — mobile only */}
        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {menuOpen ? <CloseIcon /> : <HamburgerIcon />}
        </button>

        {/* Logo */}
        <Link href="/" className="nav-logo flex items-center gap-[10px] no-underline" onClick={() => setMenuOpen(false)}>
          <Image src="/logo.png" alt="Mantis" width={38} height={43} style={{ filter: 'brightness(0.65) contrast(1.3) saturate(1.2)' }} />
          <div>
            <div className="font-serif text-[26px] font-semibold text-verde tracking-[0.14em] leading-none">
              MANTIS
            </div>
            <span className="text-[9px] font-light block tracking-[0.32em] text-dorado mt-px uppercase">
              Joyas bañadas en oro
            </span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="nav-desktop-links">
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

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Búsqueda */}
          <button
            onClick={() => setSearchOpen(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
            aria-label="Buscar"
            title="Buscar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="rgba(28,61,46,0.5)" strokeWidth="1.5" />
              <path d="M16.5 16.5L21 21" stroke="rgba(28,61,46,0.5)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          {/* Wishlist */}
          <Link
            href="/wishlist"
            className="nav-wishlist-btn"
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

      <BuscadorOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="nav-mobile-menu" style={{ zIndex: 99 }}>
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="nav-mobile-link"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </>
  )
}