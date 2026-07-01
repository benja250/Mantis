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

      <style>{`
        .dijes-hero-wrap {
          background: var(--crema-dark);
          box-shadow: 0 8px 40px rgba(28,61,46,0.10), 0 2px 8px rgba(28,61,46,0.06);
          padding: 24px;
          margin: 0 auto;
          width: 100%;
          max-width: 100%;
        }
        .dijes-hero-img {
          display: block;
          height: auto;
          object-fit: contain;
          margin: 0 auto;
          width: 100%;
          filter: drop-shadow(0 6px 24px rgba(28,61,46,0.14)) drop-shadow(0 2px 6px rgba(160,120,48,0.10));
        }
        @media (min-width: 640px)  { .dijes-hero-wrap { max-width: 95%; } }
        @media (min-width: 1024px) { .dijes-hero-wrap { max-width: 90%; } }
      `}</style>
      <div className="dijes-hero-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/dijes-hero.jpg"
          alt="Dijes Mantis — personaliza tu pulsera"
          className="dijes-hero-img"
        />
      </div>
    </section>
  )
}
