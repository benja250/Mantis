import Link from 'next/link'
import { getProductosByCategoria } from '@/lib/supabase/queries'

export default async function DijesDestacados() {
  const dijes = await getProductosByCategoria('dijes')
  if (!dijes.length) return null

  return (
    <section style={{ padding: '80px 48px', borderBottom: '0.5px solid rgba(28,61,46,0.08)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '40px', gap: '24px', flexWrap: 'wrap' }}>
        <div>
          <div style={{
            fontSize: '9px', letterSpacing: '0.32em', textTransform: 'uppercase',
            color: 'var(--dorado)', marginBottom: '12px',
          }}>
            Dijes
          </div>
          <h2 style={{
            fontFamily: 'var(--ff-serif)', fontSize: '44px', fontWeight: 300,
            color: 'var(--verde)', lineHeight: 1.05, marginBottom: '10px',
          }}>
            Personaliza tu <em style={{ fontStyle: 'italic', color: 'var(--dorado)' }}>pulsera</em>
          </h2>
          <p style={{
            fontFamily: 'var(--ff-serif)', fontSize: '17px', fontStyle: 'italic',
            color: 'rgba(28,61,46,0.45)', lineHeight: 1.5,
          }}>
            Cada pulsera es única — elige los dijes que te representen.
          </p>
        </div>
        <Link
          href="/crear-pulsera"
          style={{
            display: 'inline-block',
            background: 'var(--verde)', color: 'var(--crema)',
            padding: '14px 32px', textDecoration: 'none',
            fontSize: '10px', letterSpacing: '0.26em', textTransform: 'uppercase',
            fontFamily: 'var(--ff-sans)', whiteSpace: 'nowrap',
            transition: 'opacity 0.15s',
          }}
        >
          Crea tu pulsera →
        </Link>
      </div>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/dijes-hero.jpeg"
        alt="Dijes Mantis — personaliza tu pulsera"
        style={{ display: 'block', width: '100%', maxWidth: '1000px', height: 'auto', objectFit: 'contain', margin: '0 auto' }}
      />
    </section>
  )
}
