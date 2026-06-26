'use client'

const TALLAS = [
  { id: 'S', cm: 16 },
  { id: 'M', cm: 17 },
  { id: 'L', cm: 18 },
  { id: 'XL', cm: 19 },
]

export default function GuiaTallasModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(28,61,46,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--crema)',
          maxWidth: '480px', width: '100%',
          padding: '40px 36px 36px',
          position: 'relative',
        }}
      >
        {/* Cerrar */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '16px', right: '16px',
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#3a6b52', fontSize: '18px', lineHeight: 1, padding: '4px',
          }}
          aria-label="Cerrar"
        >
          ✕
        </button>

        {/* Título */}
        <div style={{ fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--dorado)', marginBottom: '10px' }}>
          Guía de tallas
        </div>
        <h2 style={{ fontFamily: 'var(--ff-serif)', fontSize: '28px', fontWeight: 300, color: 'var(--verde)', marginBottom: '24px' }}>
          ¿Cuánto mide<br />mi muñeca?
        </h2>

        {/* Ilustración */}
        <div style={{
          background: 'var(--crema-dark)', borderRadius: '2px',
          padding: '24px', marginBottom: '24px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
        }}>
          <svg width="200" height="100" viewBox="0 0 200 100" aria-hidden>
            {/* Muñeca */}
            <ellipse cx="100" cy="50" rx="55" ry="28" fill="none" stroke="rgba(28,61,46,0.15)" strokeWidth="1" />
            {/* Cuerda enrollada */}
            <path
              d="M 45 50 Q 60 22 100 22 Q 140 22 155 50 Q 140 78 100 78 Q 60 78 45 50"
              fill="none" stroke="var(--dorado)" strokeWidth="1.5" strokeDasharray="4 3"
            />
            {/* Marca de inicio */}
            <circle cx="45" cy="50" r="3" fill="var(--dorado)" />
            {/* Marca de fin / solape */}
            <circle cx="48" cy="50" r="3" fill="var(--verde)" opacity="0.7" />
            {/* Flechas de medición */}
            <line x1="45" y1="88" x2="155" y2="88" stroke="rgba(28,61,46,0.3)" strokeWidth="0.8" />
            <line x1="45" y1="84" x2="45" y2="92" stroke="rgba(28,61,46,0.3)" strokeWidth="0.8" />
            <line x1="155" y1="84" x2="155" y2="92" stroke="rgba(28,61,46,0.3)" strokeWidth="0.8" />
            <text x="100" y="97" textAnchor="middle" fontSize="9" fill="#3a6b52" fontFamily="sans-serif">circunferencia de muñeca</text>
          </svg>

          {/* Pasos */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
            {[
              'Rodea tu muñeca con una cinta o cordón donde llevas la pulsera.',
              'Marca el punto donde se encuentra y mide con una regla.',
              'Suma 1 cm de holgura para encontrar tu talla.',
            ].map((text, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0,
                  background: 'var(--verde)', color: 'var(--crema)',
                  fontSize: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--ff-sans)',
                }}>
                  {i + 1}
                </div>
                <p style={{ fontSize: '12px', color: '#3a6b52', lineHeight: 1.7, margin: 0 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabla de tallas */}
        <div style={{ fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--verde)', marginBottom: '10px' }}>
          Tabla de tallas
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'rgba(28,61,46,0.1)' }}>
          {TALLAS.map(({ id, cm }) => (
            <div key={id} style={{
              background: 'var(--crema)', padding: '14px 8px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
            }}>
              <span style={{ fontFamily: 'var(--ff-serif)', fontSize: '22px', fontWeight: 300, color: 'var(--verde)' }}>{id}</span>
              <span style={{ fontSize: '10px', color: '#3a6b52', letterSpacing: '0.06em' }}>{cm} cm</span>
            </div>
          ))}
        </div>

        <p style={{ fontSize: '10px', color: 'rgba(58,107,82,0.6)', marginTop: '14px', lineHeight: 1.6 }}>
          ¿Estás entre dos tallas? Elige la más grande para mayor comodidad.
        </p>
      </div>
    </div>
  )
}
