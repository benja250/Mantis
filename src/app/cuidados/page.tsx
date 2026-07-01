'use client'

import { useState } from 'react'
import GarantiaModal from '@/components/GarantiaModal'

const CARE_CARDS = [
  {
    title: 'Ponla al final',
    desc: 'Siempre después del perfume y cremas. Los químicos aceleran el desgaste.',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="5" stroke="#1C3D2E" strokeWidth="1" />
        <path d="M4.5 7l2 2 3-3" stroke="#A07830" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Sécala de inmediato',
    desc: 'Si se moja, sécala con paño suave. La humedad prolongada la daña.',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 2c0 2.5-3.5 4.5-3.5 7a3.5 3.5 0 007 0C10.5 6.5 7 4.5 7 2z" stroke="#1C3D2E" strokeWidth="1" />
      </svg>
    ),
  },
  {
    title: 'Guárdala sola',
    desc: 'En su bolsita separada para evitar roces entre joyas.',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x="2.5" y="7" width="9" height="5.5" rx="1.2" stroke="#1C3D2E" strokeWidth="1" />
        <path d="M4.5 7V6a2.5 2.5 0 015 0v1" stroke="#A07830" strokeWidth="1" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Quítatela al dormir',
    desc: 'La fricción nocturna desgasta el baño rápidamente.',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="5" stroke="#1C3D2E" strokeWidth="1" />
        <path d="M7 4v3.5l2 1.3" stroke="#A07830" strokeWidth="1" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Limpieza suave',
    desc: 'Solo con paño de microfibra seco. Nunca agua con jabón.',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M3.5 7 Q5.5 3.5 7 7 Q8.5 10.5 10.5 7" stroke="#1C3D2E" strokeWidth="1" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Úsala con consciencia',
    desc: 'Evita deporte intenso, mar y piscina. Más cuidado, más duración.',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 2L2 12h10L7 2z" stroke="#1C3D2E" strokeWidth="1" strokeLinejoin="round" />
        <line x1="7" y1="6" x2="7" y2="9" stroke="#A07830" strokeWidth="1.1" strokeLinecap="round" />
        <circle cx="7" cy="10.5" r=".7" fill="#A07830" />
      </svg>
    ),
  },
]

const EVITAR = [
  { name: 'Piscina y mar', desc: 'El cloro y la sal son corrosivos.' },
  { name: 'Perfumes', desc: 'El alcohol deteriora el baño.' },
  { name: 'Cremas y lociones', desc: 'Opacan el brillo con el tiempo.' },
  { name: 'Sudor excesivo', desc: 'Evita el gimnasio con la joya.' },
  { name: 'Productos de limpieza', desc: 'Dañan el baño irreversiblemente.' },
  { name: 'Dormir con ella', desc: 'La fricción nocturna la desgasta.' },
]

const XIcon = () => (
  <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
    <path d="M1 1l7 7M8 1L1 8" stroke="#c0392b" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
)

export default function CuidadosPage() {
  const [showGarantia, setShowGarantia] = useState(false)
  return (
    <>
    <main>
      {/* Verde Hero + strip unificados */}
      <div style={{
        background: 'var(--verde)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          width: '400px', height: '400px',
          border: '0.5px solid rgba(245,240,232,0.05)',
          borderRadius: '50%',
          top: '-80px', right: '-60px',
        }} />
        <div style={{
          minHeight: '300px',
          display: 'flex', alignItems: 'center',
          padding: '40px',
          position: 'relative', zIndex: 1,
        }}>
          <div style={{ maxWidth: '560px' }}>
            <div style={{
              fontSize: '9px', letterSpacing: '0.34em', color: 'var(--dorado-pale)',
              textTransform: 'uppercase', marginBottom: '12px',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <span style={{ display: 'inline-block', width: '16px', height: '0.5px', background: 'var(--dorado-pale)' }} />
              Guía de cuidados
            </div>
            <h1 style={{
              fontFamily: 'var(--ff-serif)', fontSize: '52px', fontWeight: 300,
              color: 'var(--crema)', lineHeight: 0.95, marginBottom: '14px',
            }}>
              Así cuidas tu<br />
              joya <em style={{ color: 'var(--dorado-pale)', fontStyle: 'italic' }}>Mantis</em>
            </h1>
            <p style={{
              fontFamily: 'var(--ff-serif)', fontSize: '15px', fontStyle: 'italic',
              color: 'rgba(245,240,232,0.4)', lineHeight: 1.7,
            }}>
              Con unos simples hábitos, tu joya bañada en oro 18k puede brillar igual por mucho tiempo.
            </p>
          </div>
        </div>
        <div style={{
          padding: '22px 40px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px',
          position: 'relative', zIndex: 1,
        }}>
          <p style={{
            fontFamily: 'var(--ff-serif)', fontSize: '16px', fontStyle: 'italic',
            color: 'rgba(245,240,232,0.55)', lineHeight: 1.5, maxWidth: '480px',
          }}>
            El baño de oro <em style={{ color: 'var(--dorado-pale)' }}>no es para siempre</em> si no se cuida — pero con los hábitos correctos, tu joya puede brillar igual por mucho tiempo.
          </p>
          <div style={{
            fontSize: '9px', letterSpacing: '0.26em',
            color: 'rgba(200,169,110,0.3)', textTransform: 'uppercase', whiteSpace: 'nowrap',
          }}>
            Guía Mantis
          </div>
        </div>
      </div>

      {/* Cómo cuidar */}
      <div style={{ padding: '40px 40px 0' }}>
        <h2 style={{ fontFamily: 'var(--ff-serif)', fontSize: '34px', fontWeight: 300, marginBottom: '4px' }}>
          Cómo <em style={{ color: 'var(--dorado)', fontStyle: 'italic' }}>cuidar</em> tu joya
        </h2>
        <p style={{ fontSize: '11px', color: '#3a6b52', letterSpacing: '0.07em', marginBottom: '28px' }}>
          Hábitos simples que marcan la diferencia
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'rgba(28,61,46,0.08)' }}>
          {CARE_CARDS.map(({ title, desc, icon }) => (
            <div key={title} style={{ background: 'var(--crema)', padding: '22px' }}>
              <div style={{
                width: '30px', height: '30px',
                border: '0.5px solid rgba(28,61,46,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '10px',
              }}>
                {icon}
              </div>
              <div style={{ fontFamily: 'var(--ff-serif)', fontSize: '17px', marginBottom: '5px' }}>{title}</div>
              <div style={{ fontSize: '11px', color: '#3a6b52', lineHeight: 1.8 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Qué evitar */}
      <div style={{ padding: '30px 40px 44px' }}>
        <h2 style={{ fontFamily: 'var(--ff-serif)', fontSize: '34px', fontWeight: 300, marginBottom: '4px' }}>
          Qué <em style={{ color: 'var(--dorado)', fontStyle: 'italic' }}>evitar</em>
        </h2>
        <p style={{ fontSize: '11px', color: '#3a6b52', letterSpacing: '0.07em', marginBottom: '24px' }}>
          Estos elementos aceleran el desgaste del baño dorado
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'rgba(28,61,46,0.08)' }}>
          {EVITAR.map(({ name, desc }) => (
            <div key={name} style={{
              background: 'var(--crema)', padding: '18px 20px',
              display: 'flex', gap: '10px', alignItems: 'flex-start',
            }}>
              <div style={{
                width: '20px', height: '20px',
                border: '0.5px solid rgba(192,57,43,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, marginTop: '1px',
              }}>
                <XIcon />
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 400, letterSpacing: '0.05em', marginBottom: '2px' }}>{name}</div>
                <div style={{ fontSize: '10px', color: '#3a6b52', lineHeight: 1.6 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Garantía strip */}
      <div style={{
        background: 'var(--verde)', padding: '40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '32px',
      }}>
        <div>
          <div style={{
            fontSize: '9px', letterSpacing: '0.3em', color: 'var(--dorado-pale)',
            opacity: 0.6, textTransform: 'uppercase', marginBottom: '8px',
          }}>
            Garantía
          </div>
          <div style={{
            fontFamily: 'var(--ff-serif)', fontSize: '30px', fontWeight: 300,
            color: 'var(--crema)', lineHeight: 1.1, marginBottom: '8px',
          }}>
            Respaldamos cada <em style={{ color: 'var(--dorado-pale)', fontStyle: 'italic' }}>pieza</em>
          </div>
          <p style={{ fontSize: '12px', color: 'rgba(245,240,232,0.38)', lineHeight: 1.8, maxWidth: '360px' }}>
            Tienes 48 horas desde la recepción de tu pedido para reportar defectos de fabricación visibles. Escríbenos con foto y número de orden.
          </p>
        </div>
        <button
          onClick={() => setShowGarantia(true)}
          style={{
            background: 'rgba(245,240,232,0.05)',
            border: '0.5px solid rgba(200,169,110,0.2)',
            padding: '22px 28px', flexShrink: 0, textAlign: 'center',
            cursor: 'pointer',
          }}
        >
          <div style={{
            fontFamily: 'var(--ff-serif)', fontSize: '48px',
            color: 'var(--dorado-pale)', lineHeight: 1, marginBottom: '3px',
          }}>
            48h
          </div>
          <div style={{ fontSize: '10px', letterSpacing: '0.22em', color: 'rgba(245,240,232,0.28)', textTransform: 'uppercase' }}>
            Para reportar defectos
          </div>
          <div style={{ fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--dorado-pale)', marginTop: '8px', opacity: 0.7 }}>
            Ver política →
          </div>
        </button>
      </div>
    </main>
    {showGarantia && <GarantiaModal onClose={() => setShowGarantia(false)} />}
    </>
  )
}
