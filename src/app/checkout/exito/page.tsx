import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Pedido confirmado — MANTIS' }

interface Props {
  searchParams: Promise<{ orden?: string; modo?: string }>
}

export default async function ExitoPage({ searchParams }: Props) {
  const { orden, modo } = await searchParams

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
        border: '0.5px solid var(--dorado)',
        borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '32px',
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M5 12l4 4 10-10" stroke="#A07830" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Etiqueta */}
      <div style={{
        fontSize: '9px', letterSpacing: '0.32em', textTransform: 'uppercase',
        color: 'var(--dorado)', marginBottom: '16px',
      }}>
        Pago recibido
      </div>

      {/* Título */}
      <h1 style={{
        fontFamily: 'var(--ff-serif)', fontSize: '44px', fontWeight: 300,
        color: 'var(--verde)', lineHeight: 1.1, marginBottom: '16px',
      }}>
        ¡Gracias por tu compra!
      </h1>

      {/* Número de orden */}
      {orden && (
        <p style={{
          fontFamily: 'var(--ff-serif)', fontSize: '17px', fontStyle: 'italic',
          color: '#3a6b52', marginBottom: '12px',
        }}>
          Tu número de pedido es{' '}
          <strong style={{ fontStyle: 'normal', color: 'var(--verde)' }}>#{orden}</strong>
        </p>
      )}

      <p style={{
        fontSize: '13px', color: '#3a6b52', lineHeight: 1.8,
        maxWidth: '420px', marginBottom: '48px',
      }}>
        Te enviaremos un email de confirmación con los detalles de tu pedido
        y el número de seguimiento cuando sea despachado.
      </p>

      {modo === 'dev' && (
        <div style={{
          background: 'rgba(160,120,48,0.08)',
          border: '0.5px solid rgba(160,120,48,0.3)',
          padding: '12px 20px',
          marginBottom: '32px',
          fontSize: '11px',
          color: 'var(--dorado)',
          letterSpacing: '0.06em',
        }}>
          Modo desarrollo — sin credenciales Flow configuradas
        </div>
      )}

      {/* CTAs */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Link href="/pulseras" style={{
          background: 'var(--verde)', color: 'var(--crema)',
          padding: '13px 30px',
          fontFamily: 'var(--ff-sans)', fontSize: '10px',
          letterSpacing: '0.24em', textTransform: 'uppercase',
          textDecoration: 'none',
        }}>
          Seguir comprando
        </Link>
        <Link href="/" style={{
          fontSize: '10px', letterSpacing: '0.2em',
          textTransform: 'uppercase', color: 'var(--dorado)',
          textDecoration: 'none', opacity: 0.8,
        }}>
          Ir al inicio
        </Link>
      </div>
    </main>
  )
}
