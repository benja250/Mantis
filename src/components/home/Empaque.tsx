function CajaSVG() {
  return (
    <svg width="220" height="200" viewBox="0 0 220 200" fill="none">
      {/* Sombra base */}
      <ellipse cx="110" cy="185" rx="70" ry="8" fill="rgba(28,61,46,0.08)" />

      {/* Cuerpo caja */}
      <rect x="30" y="80" width="160" height="100" rx="2" fill="#F5F0E8" stroke="#C8A96E" strokeWidth="0.8" />

      {/* Tapa */}
      <rect x="24" y="56" width="172" height="36" rx="2" fill="#F5F0E8" stroke="#C8A96E" strokeWidth="0.8" />
      {/* Borde inferior tapa */}
      <line x1="24" y1="90" x2="196" y2="90" stroke="#C8A96E" strokeWidth="0.5" />

      {/* Texto MANTIS en tapa */}
      <text
        x="110" y="78"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="'Cormorant Garamond', serif"
        fontSize="13"
        fontWeight="500"
        letterSpacing="5"
        fill="#A07830"
      >
        MANTIS
      </text>

      {/* Línea decorativa debajo del texto */}
      <line x1="72" y1="83" x2="148" y2="83" stroke="#A07830" strokeWidth="0.4" opacity="0.6" />

      {/* Bolsita verde adentro (visible desde arriba) */}
      <ellipse cx="110" cy="90" rx="38" ry="10" fill="#1C3D2E" opacity="0.9" />
      <path d="M72 90 Q72 130 110 134 Q148 130 148 90" fill="#1C3D2E" opacity="0.85" />
      {/* Brillo bolsita */}
      <ellipse cx="100" cy="103" rx="12" ry="6" fill="rgba(200,169,110,0.12)" transform="rotate(-20 100 103)" />

      {/* Tirante bolsita */}
      <path d="M96 90 Q96 76 110 74 Q124 76 124 90" fill="none" stroke="#274d3a" strokeWidth="1.5" />

      {/* Detalle lateral caja */}
      <line x1="30" y1="92" x2="30" y2="180" stroke="#C8A96E" strokeWidth="0.4" opacity="0.5" />
      <line x1="190" y1="92" x2="190" y2="180" stroke="#C8A96E" strokeWidth="0.4" opacity="0.5" />
    </svg>
  )
}

export default function Empaque() {
  return (
    <section className="bg-verde text-crema">
      <div className="grid grid-cols-2 empaque-grid">

        {/* Izquierda: ilustración */}
        <div
          className="flex items-center justify-center empaque-left"
          style={{
            padding: '72px 48px',
            background: 'rgba(245,240,232,0.04)',
            borderRight: '0.5px solid rgba(245,240,232,0.08)',
          }}
        >
          <CajaSVG />
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
            fontFamily: 'var(--ff-serif)', fontSize: '40px', fontWeight: 300,
            color: 'var(--crema)', lineHeight: 1.1, marginBottom: '24px',
          }}>
            Cada detalle<br />
            <em style={{ color: 'var(--dorado-pale)', fontStyle: 'italic' }}>importa</em>
          </h2>

          <p style={{ fontSize: '13px', color: 'rgba(245,240,232,0.7)', lineHeight: 2, marginBottom: '36px', maxWidth: '380px' }}>
            Tu joya llega en una caja crema con tapa rígida y el nombre MANTIS grabado
            en dorado. Dentro, una bolsita verde de tela guarda la pieza hasta que la abres.
            Lista para regalar, sin necesidad de nada más.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { title: 'Caja crema con tapa rígida', desc: 'Texto MANTIS en dorado' },
              { title: 'Bolsita verde de tela', desc: 'Tu joya protegida adentro' },
              { title: 'Sin boleta visible', desc: 'Perfecto para regalar directamente' },
            ].map(({ title, desc }) => (
              <div key={title} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '20px', height: '20px', border: '0.5px solid rgba(200,169,110,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px',
                }}>
                  <svg width="8" height="8" viewBox="0 0 8 8">
                    <path d="M1 4l2 2 4-4" stroke="#C8A96E" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--crema)', marginBottom: '2px' }}>{title}</p>
                  <p style={{ fontSize: '11px', color: 'rgba(245,240,232,0.5)', letterSpacing: '0.06em' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
