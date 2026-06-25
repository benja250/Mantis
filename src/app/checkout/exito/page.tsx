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
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 24px',
      background: 'var(--crema)',
      textAlign: 'center',
    }}>
      {/* Ícono check dorado */}
      <div style={{
        width: '80px',
        height: '80px',
        border: '1px solid var(--dorado)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '36px',
        background: 'rgba(160,120,48,0.04)',
      }}>
        <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
          <path
            d="M7 17l7 7 13-13"
            stroke="#A07830"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Etiqueta */}
      <div style={{
        fontSize: '9px',
        letterSpacing: '0.32em',
        textTransform: 'uppercase',
        color: 'var(--dorado)',
        marginBottom: '18px',
      }}>
        Pedido recibido
      </div>

      {/* Título */}
      <h1 style={{
        fontFamily: 'var(--ff-serif)',
        fontSize: 'clamp(38px, 5vw, 58px)',
        fontWeight: 300,
        color: 'var(--verde)',
        lineHeight: 1.1,
        marginBottom: '24px',
      }}>
        ¡Gracias por tu compra!
      </h1>

      {/* Número de orden destacado */}
      {orden && (
        <div style={{
          marginBottom: '28px',
          padding: '20px 40px',
          border: '0.5px solid rgba(160,120,48,0.3)',
          background: 'rgba(160,120,48,0.04)',
        }}>
          <div style={{
            fontSize: '10px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#3a6b52',
            marginBottom: '8px',
            fontFamily: 'var(--ff-sans)',
          }}>
            Número de pedido
          </div>
          <div style={{
            fontFamily: 'var(--ff-serif)',
            fontSize: 'clamp(36px, 5vw, 52px)',
            fontWeight: 300,
            color: 'var(--dorado)',
            letterSpacing: '0.04em',
            lineHeight: 1,
          }}>
            #{orden}
          </div>
        </div>
      )}

      <p style={{
        fontSize: '14px',
        color: '#3a6b52',
        lineHeight: 1.9,
        maxWidth: '440px',
        marginBottom: '12px',
        fontFamily: 'var(--ff-sans)',
      }}>
        Te enviamos un email de confirmación con los detalles de tu pedido.
      </p>
      <p style={{
        fontSize: '13px',
        color: '#3a6b52',
        lineHeight: 1.8,
        maxWidth: '440px',
        marginBottom: '48px',
        fontFamily: 'var(--ff-sans)',
        opacity: 0.75,
      }}>
        Cuando tu pedido sea despachado, recibirás otro email con el número de seguimiento.
        Nos tomará entre 1 y 2 días hábiles procesar tu transferencia.
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
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/pulseras" style={{
          background: 'var(--verde)',
          color: 'var(--crema)',
          padding: '14px 36px',
          fontFamily: 'var(--ff-sans)',
          fontSize: '10px',
          letterSpacing: '0.24em',
          textTransform: 'uppercase',
          textDecoration: 'none',
        }}>
          Seguir comprando
        </Link>
        <Link href="/seguimiento" style={{
          fontSize: '10px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--dorado)',
          textDecoration: 'none',
        }}>
          Rastrear pedido →
        </Link>
      </div>
    </main>
  )
}
