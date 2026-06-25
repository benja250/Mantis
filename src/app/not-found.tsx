import Link from 'next/link'
import Image from 'next/image'

export default function NotFound() {
  return (
    <main style={{
      minHeight: '70vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 24px',
      background: 'var(--crema)',
      textAlign: 'center',
    }}>
      <Image
        src="/logo.png"
        alt="Mantis"
        width={48}
        height={54}
        style={{ filter: 'brightness(0.65) contrast(1.3) saturate(1.2)', marginBottom: '28px', opacity: 0.6 }}
      />

      <div style={{
        fontSize: '9px',
        letterSpacing: '0.32em',
        textTransform: 'uppercase',
        color: 'var(--dorado)',
        marginBottom: '20px',
      }}>
        Error 404
      </div>

      <h1 style={{
        fontFamily: 'var(--ff-serif)',
        fontSize: 'clamp(40px, 6vw, 64px)',
        fontWeight: 300,
        color: 'var(--verde)',
        lineHeight: 1.1,
        marginBottom: '20px',
      }}>
        Página no encontrada
      </h1>

      <p style={{
        fontSize: '14px',
        color: '#3a6b52',
        lineHeight: 1.8,
        maxWidth: '380px',
        marginBottom: '48px',
        fontFamily: 'var(--ff-sans)',
      }}>
        La página que buscas no existe o fue movida.<br />
        Explora nuestra colección desde el inicio.
      </p>

      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/" style={{
          background: 'var(--verde)',
          color: 'var(--crema)',
          padding: '13px 32px',
          fontFamily: 'var(--ff-sans)',
          fontSize: '10px',
          letterSpacing: '0.24em',
          textTransform: 'uppercase',
          textDecoration: 'none',
        }}>
          Ir al inicio
        </Link>
        <Link href="/pulseras" style={{
          fontSize: '10px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--dorado)',
          textDecoration: 'none',
        }}>
          Ver pulseras →
        </Link>
      </div>
    </main>
  )
}
