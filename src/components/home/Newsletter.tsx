export default function Newsletter() {
  return (
    <div style={{
      background: 'var(--verde)',
      padding: '56px 48px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '40px',
    }}>
      {/* Texto */}
      <div>
        <div style={{
          fontSize: '9px',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'var(--dorado-pale)',
          opacity: 0.6,
          marginBottom: '12px',
        }}>
          Novedades
        </div>
        <div style={{
          fontFamily: 'var(--ff-serif)',
          fontSize: '30px',
          fontWeight: 300,
          color: 'var(--crema)',
          lineHeight: 1.2,
        }}>
          Sé la primera en ver<br />
          las nuevas <em style={{ color: 'var(--dorado-pale)', fontStyle: 'italic' }}>colecciones</em>
        </div>
      </div>

      {/* Formulario */}
      <form
        action="/api/newsletter"
        method="POST"
        style={{ display: 'flex', flexShrink: 0 }}
      >
        <input
          className="nl-input"
          type="email"
          name="email"
          placeholder="tu@correo.com"
          required
          style={{
            background: 'rgba(245,240,232,0.08)',
            border: '0.5px solid rgba(245,240,232,0.2)',
            borderRight: 'none',
            color: 'var(--crema)',
            padding: '13px 20px',
            width: '280px',
            fontFamily: 'var(--ff-sans)',
            fontSize: '12px',
          }}
        />
        <button
          className="nl-btn"
          type="submit"
          style={{
            background: 'var(--dorado)',
            color: 'var(--verde)',
            border: 'none',
            padding: '13px 24px',
            fontFamily: 'var(--ff-sans)',
            fontSize: '10px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            fontWeight: 500,
            transition: 'background 0.2s',
            whiteSpace: 'nowrap',
          }}
        >
          Suscribirse
        </button>
      </form>
    </div>
  )
}
