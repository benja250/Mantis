export default function Empaque() {
  return (
    <section className="bg-verde text-crema">
      <div className="grid grid-cols-2 empaque-grid">

        {/* Izquierda: foto real del paquete */}
        <div style={{ position: 'relative', minHeight: '480px', overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/paquete.jpg"
            alt="Empaque Mantis — caja joyero crema con bolsa verde"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Derecha: copy */}
        <div className="empaque-right" style={{ padding: '72px 56px' }}>
          <div style={{
            fontSize: '9px', letterSpacing: '0.32em', textTransform: 'uppercase',
            color: 'var(--dorado-pale)', opacity: 0.7, marginBottom: '20px',
          }}>
            Empaque
          </div>

          <h2 style={{
            fontFamily: 'var(--ff-serif)', fontSize: '36px', fontWeight: 300,
            color: 'var(--crema)', lineHeight: 1.15, marginBottom: '28px',
          }}>
            La experiencia<br />
            <em style={{ color: 'var(--dorado-pale)', fontStyle: 'italic' }}>MANTIS</em>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '380px' }}>
            <p style={{ fontSize: '13px', color: 'rgba(245,240,232,0.75)', lineHeight: 1.9 }}>
              Cada joya cuenta una historia, y queremos que la emoción comience desde el primer momento.
              Tu pieza llegará en una elegante <strong style={{ color: 'var(--crema)', fontWeight: 500 }}>caja joyero color crema</strong> con
              nuestro logo <strong style={{ color: 'var(--crema)', fontWeight: 500 }}>MANTIS</strong> en dorado,
              lista para sorprender y emocionar.
            </p>
            <p style={{ fontSize: '13px', color: 'rgba(245,240,232,0.75)', lineHeight: 1.9 }}>
              En su interior encontrarás una <strong style={{ color: 'var(--crema)', fontWeight: 500 }}>bolsa joyero verde</strong>,
              pensada para acompañarte siempre, proteger tu joya y guardar esos momentos especiales que la hacen única.
            </p>
            <p style={{ fontSize: '13px', color: 'rgba(245,240,232,0.75)', lineHeight: 1.9 }}>
              Porque cada detalle importa, y cada joya merece ser entregada como un regalo inolvidable.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
