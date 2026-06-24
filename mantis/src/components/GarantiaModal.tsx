export default function GarantiaModal({ onClose }: { onClose: () => void }) {
  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(10,20,15,0.6)', zIndex: 300 }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 301,
        width: '480px', maxWidth: '92vw',
        boxShadow: '0 32px 80px rgba(10,20,15,0.3)',
        overflow: 'hidden',
      }}>

        {/* Header verde */}
        <div style={{ background: '#1C3D2E', padding: '28px', position: 'relative' }}>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            style={{
              position: 'absolute', top: '16px', right: '16px',
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'rgba(200,169,110,0.6)', fontSize: '20px', lineHeight: 1, padding: '4px',
            }}
          >
            &times;
          </button>

          <div style={{ fontSize: '8px', letterSpacing: '0.36em', textTransform: 'uppercase', color: '#A07830', marginBottom: '16px' }}>
            Garantía Mantis
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontFamily: 'var(--ff-serif)', fontSize: '56px', fontWeight: 300, color: '#C8A96E', lineHeight: 1 }}>
              30
            </span>
            <span style={{ fontFamily: 'var(--ff-serif)', fontSize: '22px', fontWeight: 300, color: '#C8A96E', opacity: 0.8 }}>
              días
            </span>
          </div>

          <div style={{ fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.5)' }}>
            De garantía por fabricación
          </div>
        </div>

        {/* Cuerpo crema */}
        <div style={{ background: 'var(--crema)', padding: '28px' }}>

          {/* Qué cubre */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#1C3D2E', flexShrink: 0 }} />
              <span style={{ fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--verde)', fontWeight: 500 }}>
                ¿Qué cubre?
              </span>
            </div>
            <p style={{ fontSize: '13px', color: '#3a6b52', lineHeight: 1.7, margin: 0, paddingLeft: '15px' }}>
              Defectos de fabricación visibles desde el primer uso: soldaduras deficientes, cierres que no funcionan, piezas dañadas o incompletas al recibir el pedido.
            </p>
          </div>

          <div style={{ height: '0.5px', background: 'rgba(28,61,46,0.1)', marginBottom: '20px' }} />

          {/* Qué NO cubre */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#C0392B', flexShrink: 0 }} />
              <span style={{ fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#3a6b52', fontWeight: 500 }}>
                ¿Qué NO cubre?
              </span>
            </div>
            <p style={{ fontSize: '13px', color: '#3a6b52', lineHeight: 1.7, margin: 0, paddingLeft: '15px' }}>
              Desgaste por uso normal, pérdida de brillo por contacto con agua, perfumes o cremas, y rayones por roce o mal almacenamiento.
            </p>
          </div>

          {/* Box informativo */}
          <div style={{
            borderLeft: '2.5px solid #A07830',
            padding: '14px 14px 14px 16px',
            background: 'rgba(160,120,48,0.05)',
          }}>
            <p style={{ fontSize: '12px', color: '#3a6b52', lineHeight: 1.7, margin: 0 }}>
              Para hacer válida la garantía escríbenos por WhatsApp o email con foto del defecto
              y tu número de orden. Evaluamos cada caso personalmente.
            </p>
          </div>

        </div>
      </div>
    </>
  )
}