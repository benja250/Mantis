const DOS = [
  'Guardar en la bolsita incluida o en un estuche cerrado al no usarla.',
  'Secar bien antes de guardar si tuvo contacto con agua.',
  'Limpiar suavemente con un paño de microfibra seco.',
  'Ponértela después de aplicar perfume o crema hidratante.',
  'Quitártela antes de dormir para evitar el roce y la deformación.',
]

const NO_HAGAS = [
  'No la sumerjas en piscinas con cloro ni en el mar.',
  'No la expongas al sol directo por periodos prolongados.',
  'No uses productos de limpieza abrasivos ni ultrasonido.',
  'No la guardes junto a otras joyas sin separación — el roce daña el baño.',
  'No apliques perfume o alcohol directamente sobre la joya.',
]

export default function CuidadosPage() {
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
          Guía de cuidados
        </div>
        <h1 style={{
          fontFamily: 'var(--ff-serif)', fontSize: '52px', fontWeight: 300,
          color: 'var(--verde)', lineHeight: 1.05,
        }}>
          Cuida tu joya y<br />
          <em style={{ color: 'var(--dorado)', fontStyle: 'italic' }}>dura para siempre</em>
        </h1>
        <p style={{
          marginTop: '24px', fontSize: '14px', color: '#3a6b52',
          lineHeight: 1.9, maxWidth: '560px',
        }}>
          Las joyas bañadas en oro 18k son duraderas con el cuidado correcto. Aquí te contamos
          qué hacer — y qué evitar — para que tu pieza Mantis se mantenga como nueva.
        </p>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: '0', borderBottom: '0.5px solid rgba(28,61,46,0.08)',
      }}>
        {/* Sí haz */}
        <div style={{
          padding: '56px 48px',
          borderRight: '0.5px solid rgba(28,61,46,0.08)',
        }}>
          <div style={{
            fontSize: '9px', letterSpacing: '0.32em', textTransform: 'uppercase',
            color: 'var(--dorado)', marginBottom: '32px',
          }}>
            Sí haz esto
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {DOS.map((item, i) => (
              <div key={i} style={{
                display: 'flex', gap: '20px', alignItems: 'flex-start',
                padding: '20px 0',
                borderBottom: '0.5px solid rgba(28,61,46,0.08)',
              }}>
                <span style={{
                  width: '20px', height: '20px', flexShrink: 0,
                  border: '0.5px solid rgba(160,120,48,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="10" height="10" viewBox="0 0 10 10">
                    <path d="M2 5l2 2 4-4" stroke="#A07830" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <p style={{ fontSize: '13px', color: '#3a6b52', lineHeight: 1.8 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* No hagas */}
        <div style={{ padding: '56px 48px', background: 'var(--crema-dark)' }}>
          <div style={{
            fontSize: '9px', letterSpacing: '0.32em', textTransform: 'uppercase',
            color: '#C0392B', opacity: 0.7, marginBottom: '32px',
          }}>
            Evita esto
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {NO_HAGAS.map((item, i) => (
              <div key={i} style={{
                display: 'flex', gap: '20px', alignItems: 'flex-start',
                padding: '20px 0',
                borderBottom: '0.5px solid rgba(28,61,46,0.08)',
              }}>
                <span style={{
                  width: '20px', height: '20px', flexShrink: 0,
                  border: '0.5px solid rgba(192,57,43,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="10" height="10" viewBox="0 0 10 10">
                    <path d="M2.5 2.5l5 5M7.5 2.5l-5 5" stroke="#C0392B" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                </span>
                <p style={{ fontSize: '13px', color: '#3a6b52', lineHeight: 1.8 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Garantía */}
      <div style={{
        padding: '56px 48px',
        background: 'var(--crema)',
        display: 'flex', gap: '48px', alignItems: 'center',
      }}>
        <div style={{
          width: '56px', height: '56px', border: '0.5px solid rgba(160,120,48,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 3l7 4v5c0 4-3 7.5-7 9-4-1.5-7-5-7-9V7z" stroke="#A07830" strokeWidth="1" strokeLinejoin="round" />
            <path d="M9 12l2 2 4-4" stroke="#A07830" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <h3 style={{
            fontFamily: 'var(--ff-serif)', fontSize: '22px', fontWeight: 300,
            color: 'var(--verde)', marginBottom: '8px',
          }}>
            30 días de garantía por defectos de fabricación
          </h3>
          <p style={{ fontSize: '13px', color: '#3a6b52', lineHeight: 1.8, maxWidth: '600px' }}>
            Si tu joya presenta un defecto de fabricación dentro de los primeros 30 días, la
            reponemos sin costo. Esto no aplica a desgaste por uso ni a situaciones evitables
            (agua, golpes, oxidantes). Al confirmar tu pedido te enviamos el certificado de
            garantía por email.
          </p>
        </div>
      </div>
    </main>
  )
}
