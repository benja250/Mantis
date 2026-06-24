export default function NosotrosPage() {
  return (
    <main>
      {/* Hero */}
      <div style={{
        padding: '80px 48px 60px',
        background: 'var(--crema-dark)',
        borderBottom: '0.5px solid rgba(28,61,46,0.1)',
      }}>
        <div style={{
          fontSize: '9px', letterSpacing: '0.32em', textTransform: 'uppercase',
          color: 'var(--dorado)', marginBottom: '20px',
        }}>
          Nuestra historia
        </div>
        <h1 style={{
          fontFamily: 'var(--ff-serif)', fontSize: '56px', fontWeight: 300,
          color: 'var(--verde)', lineHeight: 1.05,
        }}>
          Joyas que <em style={{ color: 'var(--dorado)', fontStyle: 'italic' }}>perduran</em><br />
          en el tiempo
        </h1>
      </div>

      {/* Historia */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: '64px', padding: '72px 48px',
        borderBottom: '0.5px solid rgba(28,61,46,0.08)',
      }}>
        <div>
          <h2 style={{
            fontFamily: 'var(--ff-serif)', fontSize: '34px', fontWeight: 300,
            color: 'var(--verde)', marginBottom: '24px',
          }}>
            Un negocio de familia
          </h2>
          <p style={{ fontSize: '14px', color: '#3a6b52', lineHeight: 2, marginBottom: '20px' }}>
            Mantis nació en casa. Lo que empezó como un proyecto personal para regalar joyas
            a las personas que más queremos, se fue convirtiendo en algo más grande: una pequeña
            empresa familiar con el sueño de que todas las personas puedan acceder a joyas
            bonitas, duraderas y a un precio justo.
          </p>
          <p style={{ fontSize: '14px', color: '#3a6b52', lineHeight: 2 }}>
            Cada pieza que vendemos pasa por nuestras manos antes de llegar a las tuyas.
            Revisamos la calidad, empacamos con cuidado, y tratamos cada pedido como si fuera
            un regalo nuestro para alguien que queremos.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {[
            { year: '2022', desc: 'Los primeros regalos — pulseras hechas con amor para amigas y familia.' },
            { year: '2023', desc: 'Primeras ventas por Instagram. La respuesta nos sorprendió.' },
            { year: '2024', desc: 'Lanzamos el catálogo online. Más de 80 modelos disponibles.' },
            { year: '2025', desc: 'Despachamos a todo Chile. Mantis crece, pero sigue siendo familia.' },
          ].map(({ year, desc }, i, arr) => (
            <div key={year} style={{
              display: 'flex', gap: '28px', alignItems: 'flex-start',
              padding: '24px 0',
              borderTop: '0.5px solid rgba(28,61,46,0.1)',
              borderBottom: i === arr.length - 1 ? '0.5px solid rgba(28,61,46,0.1)' : 'none',
            }}>
              <span style={{
                fontFamily: 'var(--ff-serif)', fontSize: '24px',
                color: 'var(--dorado)', fontWeight: 300, flexShrink: 0, lineHeight: 1,
              }}>{year}</span>
              <p style={{ fontSize: '13px', color: '#3a6b52', lineHeight: 1.8 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Valores */}
      <div style={{ padding: '72px 48px', background: 'var(--crema)' }}>
        <div style={{
          fontSize: '9px', letterSpacing: '0.32em', textTransform: 'uppercase',
          color: 'var(--dorado)', marginBottom: '40px',
        }}>
          Lo que nos mueve
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'rgba(28,61,46,0.08)' }}>
          {[
            {
              title: 'Calidad real',
              desc: 'Baño de oro 18k garantizado. Resistente al agua, al sudor y al día a día. No vendemos algo que no usaríamos nosotras mismas.',
            },
            {
              title: 'Diseño con intención',
              desc: 'Cada modelo existe porque lo buscamos y no lo encontramos en otro lugar, o porque una clienta nos lo pidió. Diseñamos con propósito.',
            },
            {
              title: 'Accesibles siempre',
              desc: 'Creemos que la elegancia no tiene por qué ser cara. Trabajamos para que el precio sea justo sin sacrificar calidad.',
            },
          ].map(({ title, desc }) => (
            <div key={title} style={{
              background: 'var(--crema)', padding: '40px 36px',
            }}>
              <h3 style={{
                fontFamily: 'var(--ff-serif)', fontSize: '26px', fontWeight: 300,
                color: 'var(--verde)', marginBottom: '16px',
              }}>
                {title}
              </h3>
              <p style={{ fontSize: '13px', color: '#3a6b52', lineHeight: 1.9 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
