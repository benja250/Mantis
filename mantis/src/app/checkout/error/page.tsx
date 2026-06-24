import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Error en el pago — MANTIS' }

interface Props {
  searchParams: Promise<{ mensaje?: string }>
}

export default async function ErrorPage({ searchParams }: Props) {
  const { mensaje } = await searchParams
  const msg = mensaje ? decodeURIComponent(mensaje) : 'Ocurrió un problema al procesar tu pago.'

  return (
    <main style={{
      minHeight: '70vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 48px',
      textAlign: 'center',
    }}>
      {/* Ícono */}
      <div style={{
        width: '64px', height: '64px',
        border: '0.5px solid rgba(192,57,43,0.4)',
        borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '32px',
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M6 6l12 12M18 6L6 18" stroke="#C0392B" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* Etiqueta */}
      <div style={{
        fontSize: '9px', letterSpacing: '0.32em', textTransform: 'uppercase',
        color: 'rgba(192,57,43,0.7)', marginBottom: '16px',
      }}>
        Pago no completado
      </div>

      {/* Título */}
      <h1 style={{
        fontFamily: 'var(--ff-serif)', fontSize: '44px', fontWeight: 300,
        color: 'var(--verde)', lineHeight: 1.1, marginBottom: '20px',
      }}>
        Algo salió mal
      </h1>

      {/* Detalle del error */}
      <p style={{
        fontSize: '13px', color: '#3a6b52', lineHeight: 1.8,
        maxWidth: '400px', marginBottom: '12px',
      }}>
        {msg}
      </p>

      <p style={{
        fontSize: '12px', color: '#3a6b52', lineHeight: 1.7,
        maxWidth: '380px', marginBottom: '48px', opacity: 0.7,
      }}>
        Tu carrito no fue vaciado. Puedes volver al checkout e intentarlo
        nuevamente o contactarnos por WhatsApp.
      </p>

      {/* CTAs */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Link href="/checkout" style={{
          background: 'var(--verde)', color: 'var(--crema)',
          padding: '13px 30px',
          fontFamily: 'var(--ff-sans)', fontSize: '10px',
          letterSpacing: '0.24em', textTransform: 'uppercase',
          textDecoration: 'none',
        }}>
          Reintentar pago
        </Link>
        <a
          href="https://wa.me/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: '10px', letterSpacing: '0.2em',
            textTransform: 'uppercase', color: 'var(--dorado)',
            textDecoration: 'none', opacity: 0.8,
          }}
        >
          Contactar por WhatsApp
        </a>
      </div>
    </main>
  )
}
