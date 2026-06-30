'use client'

import { useState } from 'react'
import GuiaTallasModal from '@/components/GuiaTallasModal'

export default function BotonGuiaTallas() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '7px',
          background: 'none',
          border: '0.5px solid rgba(28,61,46,0.25)',
          padding: '9px 16px', cursor: 'pointer',
          fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase',
          color: '#3a6b52', fontFamily: 'var(--ff-sans)',
          transition: 'border-color 0.15s',
        }}
      >
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
          <circle cx="6.5" cy="6.5" r="5.5" stroke="#3a6b52" strokeWidth="0.8" />
          <path d="M6.5 3.5v3l2 1.2" stroke="#3a6b52" strokeWidth="0.8" strokeLinecap="round" />
        </svg>
        ¿Cuánto mide mi muñeca?
      </button>
      {open && <GuiaTallasModal onClose={() => setOpen(false)} />}
    </>
  )
}
