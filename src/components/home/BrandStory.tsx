'use client'

import { useState, ReactNode } from 'react'
import GarantiaModal from '@/components/GarantiaModal'

interface Feature {
  icon: ReactNode
  title: string
  desc: string
  onClick?: () => void
}

export default function BrandStory() {
  const [showGarantia, setShowGarantia] = useState(false)

  const FEATURES: Feature[] = [
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6" stroke="#1C3D2E" strokeWidth="1" />
          <path d="M5 8l2 2 4-4" stroke="#A07830" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: 'Baño oro 18k garantizado',
      desc: 'Baño de alta durabilidad, resistente al agua',
    },
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="3" y="6" width="10" height="8" rx="1.5" stroke="#1C3D2E" strokeWidth="1" />
          <path d="M5 6V5a3 3 0 016 0v1" stroke="#A07830" strokeWidth="1" strokeLinecap="round" />
        </svg>
      ),
      title: 'Pago por transferencia bancaria',
      desc: 'Simple, directo y seguro',
    },
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 2l1.5 4h4l-3.2 2.3 1.2 4L8 10.2 4.5 12.3l1.2-4L2.5 6h4z" stroke="#1C3D2E" strokeWidth="1" strokeLinejoin="round" />
          <path d="M8 3.5l1 2.8h3l-2.4 1.7.9 2.8L8 9l-2.5 1.8.9-2.8L4 6.3h3z" fill="#A07830" opacity="0.3" />
        </svg>
      ),
      title: '30 días de garantía',
      desc: 'Por fallas de fabricación, sin preguntas',
      onClick: () => setShowGarantia(true),
    },
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M13 5.5L8 2 3 5.5V11l5 3 5-3V5.5z" stroke="#1C3D2E" strokeWidth="1" strokeLinejoin="round" />
          <path d="M8 8l3-2" stroke="#A07830" strokeWidth="1" strokeLinecap="round" />
          <circle cx="8" cy="8" r="1.5" fill="#A07830" opacity="0.6" />
        </svg>
      ),
      title: 'Envío a todo Chile',
      desc: 'Santiago y regiones, con seguimiento',
    },
  ]

  return (
    <>
      <div style={{
        padding: '64px 48px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '56px',
        alignItems: 'center',
        background: 'var(--crema)',
        borderTop: '0.5px solid rgba(28,61,46,0.08)',
      }}>
        {/* Columna izquierda: texto */}
        <div>
          <div style={{
            fontSize: '9px',
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: 'var(--dorado)',
            marginBottom: '20px',
          }}>
            Nuestra historia
          </div>

          <h3 style={{
            fontFamily: 'var(--ff-serif)',
            fontSize: '38px',
            fontWeight: 300,
            color: 'var(--verde)',
            lineHeight: 1.1,
            marginBottom: '20px',
          }}>
            Joyas que <em style={{ color: 'var(--dorado)', fontStyle: 'italic' }}>perduran</em><br />
            en el tiempo
          </h3>

          <p style={{
            fontSize: '13px',
            color: '#3a6b52',
            lineHeight: 1.9,
            maxWidth: '360px',
          }}>
            Cada pieza Mantis lleva baño de oro 18k de alta durabilidad. Diseñamos joyas
            que se convierten en parte de tus momentos más especiales — porque los pequeños
            detalles son los que más importan.
          </p>
        </div>

        {/* Columna derecha: features */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {FEATURES.map(({ icon, title, desc, onClick }, i) => {
            const inner = (
              <>
                <div style={{
                  width: '36px',
                  height: '36px',
                  border: '0.5px solid rgba(28,61,46,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {icon}
                </div>
                <div>
                  <div style={{
                    fontSize: '12px',
                    letterSpacing: '0.08em',
                    color: 'var(--verde)',
                    marginBottom: '3px',
                    fontWeight: 400,
                  }}>
                    {title}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: '#3a6b52',
                    lineHeight: 1.5,
                  }}>
                    {desc}
                  </div>
                </div>
              </>
            )

            const sharedStyle: React.CSSProperties = {
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              padding: '20px 0',
              borderTop: i === 0 ? '0.5px solid rgba(28,61,46,0.1)' : 'none',
              borderBottom: '0.5px solid rgba(28,61,46,0.1)',
            }

            if (onClick) {
              return (
                <button
                  key={title}
                  onClick={onClick}
                  className="feat"
                  style={{
                    ...sharedStyle,
                    background: 'none',
                    border: 'none',
                    borderTop: sharedStyle.borderTop,
                    borderBottom: sharedStyle.borderBottom,
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  {inner}
                </button>
              )
            }

            return (
              <div key={title} className="feat" style={{ ...sharedStyle, cursor: 'default' }}>
                {inner}
              </div>
            )
          })}
        </div>
      </div>

      {showGarantia && <GarantiaModal onClose={() => setShowGarantia(false)} />}
    </>
  )
}