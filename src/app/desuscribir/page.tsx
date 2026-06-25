import Link from 'next/link'

export default function DesuscribirPage({
  searchParams,
}: {
  searchParams: { ok?: string; error?: string }
}) {
  const ok    = searchParams.ok === '1'
  const error = searchParams.error

  return (
    <main style={{
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--crema)',
      padding: '60px 24px',
    }}>
      <div style={{ maxWidth: '440px', textAlign: 'center' }}>
        <div style={{
          fontFamily: 'var(--ff-serif)',
          fontSize: '13px',
          letterSpacing: '0.26em',
          textTransform: 'uppercase',
          color: 'var(--dorado)',
          marginBottom: '20px',
        }}>
          MANTIS
        </div>

        {ok ? (
          <>
            <h1 style={{
              fontFamily: 'var(--ff-serif)',
              fontSize: '32px',
              fontWeight: 300,
              color: 'var(--verde)',
              marginBottom: '16px',
              lineHeight: 1.2,
            }}>
              Te has desuscrito correctamente
            </h1>
            <p style={{ fontSize: '14px', color: '#3a6b52', lineHeight: 1.8, marginBottom: '36px' }}>
              Ya no recibirás emails de newsletter de Mantis.<br />
              Si fue un error, puedes volver a suscribirte desde la página principal.
            </p>
          </>
        ) : error === 'email' ? (
          <>
            <h1 style={{ fontFamily: 'var(--ff-serif)', fontSize: '28px', fontWeight: 300, color: 'var(--verde)', marginBottom: '16px' }}>
              Link inválido
            </h1>
            <p style={{ fontSize: '14px', color: '#3a6b52', lineHeight: 1.8, marginBottom: '36px' }}>
              El link de desuscripción no contiene un email válido. Por favor contáctanos directamente.
            </p>
          </>
        ) : (
          <>
            <h1 style={{ fontFamily: 'var(--ff-serif)', fontSize: '28px', fontWeight: 300, color: 'var(--verde)', marginBottom: '16px' }}>
              Algo salió mal
            </h1>
            <p style={{ fontSize: '14px', color: '#3a6b52', lineHeight: 1.8, marginBottom: '36px' }}>
              No pudimos procesar tu solicitud. Intenta de nuevo o contáctanos.
            </p>
          </>
        )}

        <Link href="/" style={{
          fontSize: '10px',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'var(--dorado)',
          textDecoration: 'none',
        }}>
          ← Volver al inicio
        </Link>
      </div>
    </main>
  )
}
