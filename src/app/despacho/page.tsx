export default function DespachoPage() {
  return (
    <main>
      {/* Verde Hero */}
      <div style={{
        minHeight: '220px',
        background: 'var(--verde)',
        display: 'flex',
        alignItems: 'flex-end',
        position: 'relative',
        overflow: 'hidden',
        padding: '40px',
      }}>
        <div style={{
          position: 'absolute',
          width: '400px', height: '400px',
          border: '0.5px solid rgba(245,240,232,0.05)',
          borderRadius: '50%',
          top: '-80px', right: '-60px',
        }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '560px' }}>
          <div style={{
            fontSize: '9px', letterSpacing: '0.34em', color: 'var(--dorado-pale)',
            textTransform: 'uppercase', marginBottom: '12px',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <span style={{ display: 'inline-block', width: '16px', height: '0.5px', background: 'var(--dorado-pale)' }} />
            Logística
          </div>
          <h1 style={{
            fontFamily: 'var(--ff-serif)', fontSize: '52px', fontWeight: 300,
            color: 'var(--crema)', lineHeight: 0.95,
          }}>
            Despacho a<br />
            <em style={{ color: 'var(--dorado-pale)', fontStyle: 'italic' }}>todo Chile</em>
          </h1>
        </div>
      </div>

      {/* Zonas */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: '1px', background: 'rgba(28,61,46,0.08)',
        margin: '0 40px',
      }}>
        <div style={{ background: 'var(--crema)', padding: '28px' }}>
          <div style={{
            width: '36px', height: '36px',
            border: '0.5px solid rgba(28,61,46,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '12px',
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1.5C5.5 1.5 3 4 3 7c0 4 5 8 5 8s5-4 5-8c0-3-2.5-5.5-5-5.5z" stroke="#1C3D2E" strokeWidth="1" />
              <circle cx="8" cy="7" r="2" fill="#A07830" />
            </svg>
          </div>
          <div style={{ fontFamily: 'var(--ff-serif)', fontSize: '20px', marginBottom: '3px' }}>Región Metropolitana</div>
          <div style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--dorado)', marginBottom: '10px' }}>
            Via Paket
          </div>
          <div style={{ fontFamily: 'var(--ff-serif)', fontSize: '28px', color: 'var(--verde)', lineHeight: 1, marginBottom: '3px' }}>
            24-48
          </div>
          <div style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#3a6b52', marginBottom: '10px' }}>
            Hrs hábiles
          </div>
          <p style={{ fontSize: '11px', color: '#3a6b52', lineHeight: 1.8 }}>
            Paket se comunica por WhatsApp o llamada. Hasta 2 intentos de entrega gratuitos. Entrega entre 9:00 y 22:00 hrs.
          </p>
        </div>

        <div style={{ background: 'var(--crema)', padding: '28px' }}>
          <div style={{
            width: '36px', height: '36px',
            border: '0.5px solid rgba(28,61,46,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '12px',
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2.5 8.5l5.5-5 5.5 5v6H2.5v-6z" stroke="#1C3D2E" strokeWidth="1" strokeLinejoin="round" />
              <rect x="6" y="10" width="4" height="4.5" stroke="#A07830" strokeWidth=".8" />
            </svg>
          </div>
          <div style={{ fontFamily: 'var(--ff-serif)', fontSize: '20px', marginBottom: '3px' }}>Resto de Chile</div>
          <div style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--dorado)', marginBottom: '10px' }}>
            Via Starken
          </div>
          <div style={{ fontFamily: 'var(--ff-serif)', fontSize: '28px', color: 'var(--verde)', lineHeight: 1, marginBottom: '3px' }}>
            2-8
          </div>
          <div style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#3a6b52', marginBottom: '10px' }}>
            Días hábiles según región
          </div>
          <p style={{ fontSize: '11px', color: '#3a6b52', lineHeight: 1.8 }}>
            Regiones centrales: 2-3 días. Regiones extremas (I, II, XI, XII): hasta 12 días. Recibes número de tracking por email.
          </p>
        </div>
      </div>

      {/* Info cards */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1px', background: 'rgba(28,61,46,0.08)',
        margin: '1px 40px 44px',
      }}>
        {[
          {
            title: 'Costo de despacho',
            text: 'El costo varía según tu ubicación. Al finalizar la compra se calculará automáticamente antes de confirmar.',
          },
          {
            title: 'Seguimiento',
            text: 'Tracking enviado por email. Rastrear en track.paket.cl (RM) o starken.cl (Regiones)',
          },
          {
            title: 'Plazos',
            text: 'Desde confirmación de transferencia. Lunes a viernes, días hábiles.',
          },
        ].map(({ title, text }) => (
          <div key={title} style={{ background: 'var(--crema)', padding: '20px' }}>
            <div style={{
              fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase',
              color: '#3a6b52', marginBottom: '5px',
            }}>
              {title}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--verde)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
              {text}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
