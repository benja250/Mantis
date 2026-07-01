'use client'

import { useState, useEffect } from 'react'

export default function HeroCarousel({ images }: { images: string[] }) {
  const [idx, setIdx] = useState(0)
  const [resetKey, setResetKey] = useState(0)

  function navigate(newIdx: number) {
    setIdx(newIdx)
    setResetKey(k => k + 1)
  }

  useEffect(() => {
    if (images.length <= 1) return
    const timer = setInterval(() => setIdx(i => (i + 1) % images.length), 6000)
    return () => clearInterval(timer)
  }, [images.length, resetKey])

  if (!images.length) return null

  const arrowStyle: React.CSSProperties = {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)',
    background: 'rgba(237,229,212,0.82)', border: 'none',
    color: 'rgba(28,61,46,0.9)', cursor: 'pointer',
    width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '18px', zIndex: 3, transition: 'background 0.2s',
    backdropFilter: 'blur(2px)',
  }

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {images.map((url, i) => (
        <div
          key={url}
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: i === idx ? 1 : 0,
            transition: 'opacity 0.9s ease-in-out',
          }}
        />
      ))}

      {images.length > 1 && (
        <>
          <button onClick={() => navigate((idx - 1 + images.length) % images.length)} style={{ ...arrowStyle, left: '12px' }}>‹</button>
          <button onClick={() => navigate((idx + 1) % images.length)} style={{ ...arrowStyle, right: '12px' }}>›</button>

          <div style={{
            position: 'absolute', bottom: '14px', left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex', gap: '6px', zIndex: 2,
          }}>
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => navigate(i)}
                style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: i === idx ? 'rgba(245,240,232,0.92)' : 'rgba(245,240,232,0.3)',
                  border: 'none', cursor: 'pointer', padding: 0,
                  transition: 'background 0.3s',
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
