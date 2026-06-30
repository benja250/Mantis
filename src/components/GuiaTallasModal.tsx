'use client'

const TALLAS = [
  { id: 'S',  largo: '16 cm', muneca: '14–15 cm', para: 'Muñecas pequeñas' },
  { id: 'M',  largo: '17 cm', muneca: '15–16 cm', para: 'Talla más vendida' },
  { id: 'L',  largo: '18 cm', muneca: '16–17 cm', para: 'Muñecas medianas' },
  { id: 'XL', largo: '19 cm', muneca: '17+ cm',   para: 'Muñecas grandes' },
]

export default function GuiaTallasModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(28,61,46,0.45)',
        backdropFilter: 'blur(3px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--crema)',
          maxWidth: '500px', width: '100%',
          padding: '40px 36px 36px',
          position: 'relative',
          maxHeight: 'calc(100vh - 48px)',
          overflowY: 'auto',
        }}
      >
        {/* Cerrar */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '16px', right: '16px',
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#3a6b52', fontSize: '16px', lineHeight: 1, padding: '4px',
          }}
          aria-label="Cerrar"
        >
          ✕
        </button>

        {/* Título */}
        <h2 style={{ fontFamily: 'var(--ff-serif)', fontSize: '32px', fontWeight: 300, color: 'var(--verde)', marginBottom: '6px', lineHeight: 1.1 }}>
          ¿Cuánto mide<br />tu <em style={{ color: 'var(--dorado)', fontStyle: 'italic' }}>muñeca</em>?
        </h2>
        <p style={{ fontSize: '12px', color: '#3a6b52', marginBottom: '28px' }}>
          Mide tu muñeca para elegir la talla perfecta
        </p>

        {/* Cómo medir */}
        <div style={{ background: 'var(--crema-dark)', padding: '20px 24px', marginBottom: '28px' }}>
          <div style={{ fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#3a6b52', marginBottom: '14px' }}>
            Cómo medir
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              'Toma un hilo o cinta de papel y envuelve tu muñeca justo debajo del hueso.',
              'Marca el punto donde se cruzan los extremos y mide la longitud.',
              'Suma 1 cm para ajustada o 1.5 cm para más comodidad.',
            ].map((text, i) => (
              <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '11px', color: 'rgba(58,107,82,0.4)', minWidth: '12px', paddingTop: '1px' }}>{i + 1}</span>
                <p style={{ fontSize: '12px', color: '#3a6b52', lineHeight: 1.7, margin: 0 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabla */}
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '0.5px solid rgba(28,61,46,0.12)' }}>
              {['Talla', 'Largo pulsera', 'Muñeca aprox.', 'Para'].map(h => (
                <th key={h} style={{ fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#3a6b52', fontWeight: 400, padding: '8px 0', textAlign: 'left' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TALLAS.map(({ id, largo, muneca, para }) => (
              <tr key={id} style={{ borderBottom: '0.5px solid rgba(28,61,46,0.06)' }}>
                <td style={{ padding: '13px 0', fontFamily: 'var(--ff-serif)', fontSize: '20px', color: 'var(--verde)', fontWeight: 300 }}>{id}</td>
                <td style={{ padding: '13px 0', fontSize: '13px', color: 'var(--verde)' }}>{largo}</td>
                <td style={{ padding: '13px 0', fontSize: '13px', color: 'var(--verde)' }}>{muneca}</td>
                <td style={{ padding: '13px 0', fontSize: '11px', color: id === 'M' ? 'var(--dorado)' : '#3a6b52', letterSpacing: '0.04em' }}>{para}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
