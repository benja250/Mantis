'use client'

import { useState } from 'react'
import GarantiaModal from '@/components/GarantiaModal'

const STATS = [
  { num: '18k',  label: 'Baño de oro' },
  { num: '+80',  label: 'Modelos' },
  { num: '+200', label: 'Joyas vendidas' },
  { num: '30',   label: 'Días de garantía', clickable: true },
]

export default function Stats() {
  const [showGarantia, setShowGarantia] = useState(false)

  return (
    <>
      <div className="stats-grid">
        {STATS.map(({ num, label, clickable }, i) => {
          const content = (
            <>
              <div style={{
                fontFamily: 'var(--ff-serif)',
                fontSize: '34px',
                fontWeight: 400,
                color: 'var(--dorado)',
                marginBottom: '5px',
                lineHeight: 1,
              }}>
                {num}
              </div>
              <div style={{
                fontSize: '10px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#3a6b52',
              }}>
                {label}
              </div>
            </>
          )

          const cellStyle: React.CSSProperties = {
            padding: '28px 48px',
            borderTop: '0.5px solid rgba(28,61,46,0.1)',
            borderBottom: '0.5px solid rgba(28,61,46,0.1)',
            borderRight: i < STATS.length - 1 ? '0.5px solid rgba(28,61,46,0.1)' : 'none',
          }

          if (clickable) {
            return (
              <button
                key={num}
                onClick={() => setShowGarantia(true)}
                style={{
                  padding: '28px 48px',
                  background: 'none',
                  border: 'none',
                  borderTop: '0.5px solid rgba(28,61,46,0.1)',
                  borderBottom: '0.5px solid rgba(28,61,46,0.1)',
                  borderRight: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                className="stat-clickable"
              >
                {content}
                <div style={{ fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--dorado)', marginTop: '6px', opacity: 0.7 }}>
                  Ver política →
                </div>
              </button>
            )
          }

          return (
            <div key={num} style={cellStyle}>
              {content}
            </div>
          )
        })}
      </div>

      {showGarantia && <GarantiaModal onClose={() => setShowGarantia(false)} />}
    </>
  )
}