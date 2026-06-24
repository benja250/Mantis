import Link from 'next/link'

export default function DespachoPage() {
  return (
    <main>
      <div style={{
        padding: '80px 48px 60px',
        background: 'var(--crema-dark)',
        borderBottom: '0.5px solid rgba(28,61,46,0.1)',
      }}>
        <div style={{
          fontSize: '9px', letterSpacing: '0.32em', textTransform: 'uppercase',
          color: 'var(--dorado)', marginBottom: '20px',
        }}>
          Envíos
        </div>
        <h1 style={{
          fontFamily: 'var(--ff-serif)', fontSize: '52px', fontWeight: 300,
          color: 'var(--verde)', lineHeight: 1.05,
        }}>
          Despachamos a<br />
          <em style={{ color: 'var(--dorado)', fontStyle: 'italic' }}>todo Chile</em>
        </h1>
        <p style={{
          marginTop: '24px', fontSize: '14px', color: '#3a6b52',
          lineHeight: 1.9, maxWidth: '480px',
        }}>
          Empacamos cada pedido con cuidado y lo despachamos el mismo día si compras
          antes de las 18:00 (días hábiles).
        </p>
      </div>

      {/* Couriers */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: '1px', background: 'rgba(28,61,46,0.08)',
        margin: '56px 48px',
      }}>
        {[
          {
            label: 'Región Metropolitana',
            courier: 'Paket',
            plazo: '24–48 horas hábiles',
            costo: 'Gratis sobre $30.000',
            desc: 'Seguimiento en tiempo real. Entrega en tu puerta sin necesidad de ir a buscar el paquete.',
          },
          {
            label: 'Regiones',
            courier: 'Starken',
            plazo: '2–8 días hábiles',
            costo: 'Gratis sobre $30.000',
            desc: 'Retiro en sucursal o despacho a domicilio. Seguimiento incluido con número de OT.',
          },
        ].map(({ label, courier, plazo, costo, desc }) => (
          <div key={courier} style={{ background: 'var(--crema)', padding: '40px 36px' }}>
            <div style={{
              fontSize: '9px', letterSpacing: '0.32em', textTransform: 'uppercase',
              color: 'var(--dorado)', marginBottom: '16px',
            }}>
              {label}
            </div>
            <h2 style={{
              fontFamily: 'var(--ff-serif)', fontSize: '32px', fontWeight: 300,
              color: 'var(--verde)', marginBottom: '20px',
            }}>
              {courier}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'baseline' }}>
                <span style={{
                  fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: 'var(--dorado)', flexShrink: 0,
                }}>
                  Plazo
                </span>
                <span style={{ fontSize: '13px', color: 'var(--verde)' }}>{plazo}</span>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'baseline' }}>
                <span style={{
                  fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: 'var(--dorado)', flexShrink: 0,
                }}>
                  Costo
                </span>
                <span style={{ fontSize: '13px', color: 'var(--verde)' }}>{costo}</span>
              </div>
            </div>
            <p style={{ fontSize: '12px', color: '#3a6b52', lineHeight: 1.8 }}>{desc}</p>
          </div>
        ))}
      </div>

      {/* Info adicional */}
      <div style={{
        padding: '0 48px 72px',
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px',
      }}>
        {[
          {
            icon: '📦',
            title: 'Empaque especial',
            desc: 'Caja crema con tapa rígida y texto MANTIS en dorado. Dentro, bolsita verde con tu joya. Perfecto para regalar.',
          },
          {
            icon: '⏰',
            title: 'Despacho el mismo día',
            desc: 'Pedidos confirmados antes de las 18:00 (días hábiles) salen el mismo día.',
          },
          {
            icon: '📧',
            title: 'Seguimiento por email',
            desc: 'Recibes el número de seguimiento por email en cuanto despachamos tu pedido.',
          },
        ].map(({ title, desc }) => (
          <div key={title} style={{
            padding: '28px 0',
            borderTop: '0.5px solid rgba(28,61,46,0.1)',
          }}>
            <h3 style={{
              fontFamily: 'var(--ff-serif)', fontSize: '18px', fontWeight: 300,
              color: 'var(--verde)', marginBottom: '10px',
            }}>
              {title}
            </h3>
            <p style={{ fontSize: '12px', color: '#3a6b52', lineHeight: 1.8 }}>{desc}</p>
          </div>
        ))}
      </div>

      {/* CTA seguimiento */}
      <div style={{
        margin: '0 48px 72px',
        padding: '32px 36px',
        background: 'var(--crema-dark)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <p style={{ fontSize: '13px', color: 'var(--verde)', marginBottom: '4px' }}>
            ¿Ya hiciste tu pedido?
          </p>
          <p style={{ fontSize: '11px', color: '#3a6b52', letterSpacing: '0.06em' }}>
            Ingresa tu número de orden para ver el estado del despacho.
          </p>
        </div>
        <Link href="/seguimiento" style={{
          background: 'var(--verde)', color: 'var(--crema)',
          padding: '12px 28px', textDecoration: 'none',
          fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase',
          fontFamily: 'var(--ff-sans)',
        }}>
          Seguir pedido →
        </Link>
      </div>
    </main>
  )
}
