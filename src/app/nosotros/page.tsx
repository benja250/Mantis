import Image from 'next/image'

export default function NosotrosPage() {
  return (
    <main>
      {/* Verde Hero */}
      <div style={{
        minHeight: '300px',
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
            Nuestra historia
          </div>
          <h1 style={{
            fontFamily: 'var(--ff-serif)', fontSize: '52px', fontWeight: 300,
            color: 'var(--crema)', lineHeight: 0.95, marginBottom: '14px',
          }}>
            Un negocio<br />
            de <em style={{ color: 'var(--dorado-pale)', fontStyle: 'italic' }}>familia.</em>
          </h1>
          <p style={{
            fontFamily: 'var(--ff-serif)', fontSize: '15px', fontStyle: 'italic',
            color: 'rgba(245,240,232,0.4)', lineHeight: 1.7,
          }}>
            Mantis nació del amor por los detalles que hacen grande un día.
          </p>
        </div>
      </div>

      {/* Historia */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <div style={{
          background: 'var(--crema-dark)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          minHeight: '340px', position: 'relative',
        }}>
          <Image
            src="/logo.png"
            alt="Mantis"
            width={345}
            height={391}
            quality={100}
            style={{ objectFit: 'contain', width: '180px', height: 'auto', position: 'relative', zIndex: 1 }}
          />
        </div>
        <div style={{
          padding: '48px 40px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
        }}>
          <div style={{
            fontSize: '9px', letterSpacing: '0.34em', color: 'var(--dorado)',
            textTransform: 'uppercase', marginBottom: '12px',
            display: 'flex', alignItems: 'center', gap: '7px',
          }}>
            <span style={{ display: 'inline-block', width: '13px', height: '0.5px', background: 'var(--dorado)' }} />
            El origen
          </div>
          <h2 style={{
            fontFamily: 'var(--ff-serif)', fontSize: '36px', fontWeight: 300,
            lineHeight: 1, marginBottom: '18px',
          }}>
            Todo empezó con<br />
            una <em style={{ color: 'var(--dorado)', fontStyle: 'italic' }}>búsqueda</em>
          </h2>
          <p style={{ fontSize: '13px', color: '#3a6b52', lineHeight: 2, marginBottom: '10px' }}>
            Mantis es un emprendimiento familiar que nació de la búsqueda de una joya bonita, duradera y accesible. Lo que no encontramos afuera, decidimos crearlo nosotras.
          </p>
          <p style={{ fontSize: '13px', color: '#3a6b52', lineHeight: 2 }}>
            Cada pieza está pensada para acompañarte en lo cotidiano y en lo especial, bañada en oro 18k y diseñada para durar.
          </p>
        </div>
      </div>

      {/* Quote */}
      <div style={{ padding: '44px 40px', background: 'var(--crema-dark)', textAlign: 'center' }}>
        <p style={{
          fontFamily: 'var(--ff-serif)', fontSize: '26px', fontStyle: 'italic', fontWeight: 300,
          lineHeight: 1.4, maxWidth: '540px', margin: '0 auto 12px',
        }}>
          &ldquo;Porque creemos que no necesitas una ocasión <em style={{ color: 'var(--dorado)' }}>especial</em> para brillar.&rdquo;
        </p>
        <div style={{ fontSize: '10px', letterSpacing: '0.26em', textTransform: 'uppercase', color: '#3a6b52' }}>
          — Mantis, joyas bañadas en oro
        </div>
      </div>

      {/* Valores */}
      <div style={{ padding: '48px 40px' }}>
        <h2 style={{
          fontFamily: 'var(--ff-serif)', fontSize: '34px', fontWeight: 300,
          marginBottom: '32px', textAlign: 'center',
        }}>
          Lo que nos <em style={{ color: 'var(--dorado)', fontStyle: 'italic' }}>define</em>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'rgba(28,61,46,0.08)' }}>
          {[
            {
              icon: (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="5" stroke="#1C3D2E" strokeWidth="1" />
                  <path d="M4.5 7l2 2 3-3" stroke="#A07830" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ),
              name: 'Calidad real',
              desc: 'Baño de oro 18k de alta durabilidad. Sin atajos.',
            },
            {
              icon: (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1.5l1.3 3.5h3.5L9 7l1 3.5L7 9l-3 1.5L5 7 2.2 5h3.5z" stroke="#1C3D2E" strokeWidth="1" strokeLinejoin="round" />
                </svg>
              ),
              name: 'Diseño con intención',
              desc: 'Cada pieza pensada para quien la usa.',
            },
            {
              icon: (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="5" stroke="#1C3D2E" strokeWidth="1" />
                  <path d="M7 4v3.5l2 1.3" stroke="#A07830" strokeWidth="1" strokeLinecap="round" />
                </svg>
              ),
              name: 'Accesibles siempre',
              desc: 'Precios justos para joyas que duran.',
            },
          ].map(({ icon, name, desc }) => (
            <div key={name} style={{ background: 'var(--crema)', padding: '28px' }}>
              <div style={{
                width: '32px', height: '32px',
                border: '0.5px solid rgba(28,61,46,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '10px',
              }}>
                {icon}
              </div>
              <div style={{ fontFamily: 'var(--ff-serif)', fontSize: '19px', marginBottom: '6px' }}>{name}</div>
              <div style={{ fontSize: '11px', color: '#3a6b52', lineHeight: 1.8 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Marquee */}
      <div style={{ padding: '18px 0', background: 'var(--verde)', overflow: 'hidden', whiteSpace: 'nowrap' }}>
        <div className="marquee-track">
          {[
            'Negocio familiar', 'Bañadas en oro 18k', 'Santiago, Chile', 'Para brillar todos los días',
            'Negocio familiar', 'Bañadas en oro 18k', 'Santiago, Chile', 'Para brillar todos los días',
          ].map((item, i) => (
            <span key={i} style={{
              display: 'inline-block',
              fontFamily: 'var(--ff-serif)', fontSize: '14px', fontStyle: 'italic',
              color: 'rgba(245,240,232,0.4)', padding: '0 36px',
            }}>
              {item} <span style={{ color: 'var(--dorado-pale)' }}>·</span>
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{
            fontSize: '9px', letterSpacing: '0.3em', color: 'var(--dorado)',
            textTransform: 'uppercase', marginBottom: '7px',
          }}>
            Nuestra colección
          </div>
          <div style={{ fontFamily: 'var(--ff-serif)', fontSize: '30px', fontWeight: 300 }}>
            Ver las joyas que<br />
            creamos <em style={{ color: 'var(--dorado)', fontStyle: 'italic' }}>para ti</em>
          </div>
        </div>
        <a href="/pulseras" style={{
          background: 'var(--verde)', color: 'var(--crema)',
          padding: '12px 26px', textDecoration: 'none',
          fontFamily: 'var(--ff-sans)', fontSize: '10px',
          letterSpacing: '0.22em', textTransform: 'uppercase',
          display: 'inline-block',
        }}>
          Ver colección →
        </a>
      </div>
    </main>
  )
}
