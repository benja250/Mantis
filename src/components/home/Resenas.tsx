export const revalidate = 0

import { createClient } from '@/lib/supabase/server'

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

function fmtFecha(iso: string) {
  const d = new Date(iso)
  return `${MESES[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

function Estrellas({ n }: { n: number }) {
  return (
    <div style={{ display: 'flex', gap: '3px' }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 12 12">
          <path
            d="M6 1l1.4 2.8 3.1.4-2.2 2.2.5 3.1L6 8l-2.8 1.5.5-3.1L1.5 4.2l3.1-.4z"
            fill={i < n ? '#A07830' : 'rgba(160,120,48,0.2)'}
          />
        </svg>
      ))}
    </div>
  )
}

export default async function Resenas() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('resenas')
    .select('id, nombre_cliente, texto, calificacion, fecha, productos(nombre)')
    .eq('destacada', true)
    .eq('aprobada', true)
    .order('fecha', { ascending: false })
    .limit(3)

  console.log('[Resenas] query result — count:', data?.length ?? 0, '| error:', error?.message ?? null)

  const resenas = (data ?? []).map(r => ({
    id: r.id,
    nombre: r.nombre_cliente,
    texto: r.texto,
    estrellas: r.calificacion,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    producto: (r.productos as any)?.nombre ?? '',
    fecha: fmtFecha(r.fecha),
  }))

  if (resenas.length === 0) return null

  return (
    <section className="resenas-section" style={{
      background: '#EDE5D4',
      borderTop: '0.5px solid rgba(28,61,46,0.08)',
      padding: '72px 48px',
    }}>
      {/* Encabezado */}
      <div className="resenas-header" style={{ marginBottom: '48px' }}>
        <div style={{
          fontSize: '9px', letterSpacing: '0.32em', textTransform: 'uppercase',
          color: 'var(--dorado)', marginBottom: '12px',
        }}>
          Reseñas
        </div>
        <div className="resenas-header-row" style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <h2 style={{
            fontFamily: 'var(--ff-serif)', fontSize: '38px', fontWeight: 300, color: 'var(--verde)',
          }}>
            Lo que dicen <em style={{ color: 'var(--dorado)', fontStyle: 'italic' }}>ellas</em>
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Estrellas n={5} />
            <span style={{ fontSize: '11px', color: '#3a6b52', letterSpacing: '0.08em' }}>
              5.0 · +200 reseñas
            </span>
          </div>
        </div>
      </div>

      {/* Grid reseñas */}
      <div className="resenas-grid">
        {resenas.map(r => (
          <div key={r.id} style={{
            background: '#EDE5D4', padding: '32px 28px',
            display: 'flex', flexDirection: 'column', gap: '16px',
          }}>
            <Estrellas n={r.estrellas} />

            <p style={{
              fontFamily: 'var(--ff-serif)', fontSize: '17px', fontStyle: 'italic',
              color: 'var(--verde)', lineHeight: 1.7, flex: 1,
            }}>
              &ldquo;{r.texto}&rdquo;
            </p>

            <div style={{ borderTop: '0.5px solid rgba(28,61,46,0.08)', paddingTop: '16px' }}>
              <p style={{ fontSize: '12px', color: 'var(--verde)', marginBottom: '3px' }}>{r.nombre}</p>
              <p style={{ fontSize: '10px', color: 'var(--dorado)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                {r.fecha}{r.producto ? ` · ${r.producto}` : ''}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
