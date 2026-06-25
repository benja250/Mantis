'use client'

import type { Resena } from '@/lib/supabase/queries'

function Estrellas({ n }: { n: number }) {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24">
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill={i <= n ? '#A07830' : 'none'}
            stroke="#A07830"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </div>
  )
}

function fechaLegible(iso: string) {
  return new Date(iso).toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function ResenasList({ resenas }: { resenas: Resena[] }) {
  if (resenas.length === 0) return null

  const promedio = resenas.reduce((s, r) => s + r.calificacion, 0) / resenas.length

  return (
    <div style={{ padding: '56px 48px', borderTop: '0.5px solid rgba(28,61,46,0.1)' }}>
      {/* Encabezado */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '20px', marginBottom: '36px' }}>
        <h2 style={{
          fontFamily: 'var(--ff-serif)',
          fontSize: '28px',
          fontWeight: 300,
          color: 'var(--verde)',
        }}>
          Reseñas
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Estrellas n={Math.round(promedio)} />
          <span style={{ fontSize: '12px', color: '#3a6b52' }}>
            {promedio.toFixed(1)} ({resenas.length} {resenas.length === 1 ? 'reseña' : 'reseñas'})
          </span>
        </div>
      </div>

      {/* Lista */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '720px' }}>
        {resenas.map(r => (
          <div key={r.id} style={{
            padding: '24px',
            background: 'var(--crema-dark)',
            borderLeft: '2px solid var(--dorado)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <div>
                <Estrellas n={r.calificacion} />
                <div style={{ fontFamily: 'var(--ff-serif)', fontSize: '16px', color: 'var(--verde)', marginTop: '6px' }}>
                  {r.nombre_cliente}
                </div>
              </div>
              <span style={{ fontSize: '11px', color: '#3a6b52', opacity: 0.6 }}>
                {fechaLegible(r.fecha)}
              </span>
            </div>
            <p style={{ fontSize: '13px', color: '#3a6b52', lineHeight: 1.8, margin: 0 }}>
              {r.texto}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
