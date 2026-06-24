import Link from 'next/link'

const LINKS = [
  { href: 'https://instagram.com/mantisjoyas', label: 'Instagram', external: true },
  { href: 'https://wa.me/56900000000',         label: 'WhatsApp',  external: true },
  { href: '/despacho',                          label: 'Despacho',  external: false },
  { href: '/cuidados',                          label: 'Cuidados',  external: false },
  { href: '/privacidad',                        label: 'Privacidad', external: false },
  { href: '/faq',                               label: 'FAQ',       external: false },
]

export default function Footer() {
  return (
    <footer
      className="flex items-center justify-between bg-crema footer-bar"
      style={{ borderTop: '0.5px solid rgba(28,61,46,0.1)', padding: '40px 80px' }}
    >
      <div className="font-serif text-[20px] text-verde tracking-[0.14em] font-medium">
        MANTIS
      </div>

      <div className="flex footer-links" style={{ gap: '32px' }}>
        {LINKS.map(({ href, label, external }) =>
          external ? (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link text-[10px] tracking-[0.18em] uppercase text-verde-light no-underline transition-colors duration-200"
            >
              {label}
            </a>
          ) : (
            <Link
              key={label}
              href={href}
              className="footer-link text-[10px] tracking-[0.18em] uppercase text-verde-light no-underline transition-colors duration-200"
            >
              {label}
            </Link>
          )
        )}
      </div>

      <div style={{ fontSize: '11px', letterSpacing: '0.12em', color: 'var(--verde)', opacity: 0.6, textTransform: 'uppercase' }}>
        © 2026 Mantis · Joyas bañadas en oro
      </div>
    </footer>
  )
}
