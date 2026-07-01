import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/server'
import HeroCarousel from './HeroCarousel'

async function getHeroImages(): Promise<string[]> {
  try {
    const sb = createServiceClient()
    const { data: files } = await sb.storage.from('productos').list('general')
    if (!files?.length) return []
    const heroFiles = files
      .filter(f => f.name.startsWith('hero'))
      .sort((a, b) => a.name.localeCompare(b.name))
    return heroFiles.map(
      f => sb.storage.from('productos').getPublicUrl(`general/${f.name}`).data.publicUrl
    )
  } catch { return [] }
}

function BraceletSVG() {
  return (
    <svg width="260" height="200" viewBox="0 0 260 200">
      {/* Cadena snake */}
      <path d="M30 100 Q65 100 130 100 Q195 100 230 100" fill="none" stroke="#A07830" strokeWidth="8" strokeLinecap="round" />
      <path d="M30 100 Q65 100 130 100 Q195 100 230 100" fill="none" stroke="#C8A96E" strokeWidth="3" strokeLinecap="round" strokeDasharray="4 6" />
      {/* Cierre izquierda */}
      <rect x="18" y="93" width="16" height="14" rx="4" fill="#A07830" />
      <rect x="20" y="95" width="12" height="10" rx="3" fill="#1C3D2E" stroke="#A07830" strokeWidth="0.5" />
      <text x="26" y="101" textAnchor="middle" dominantBaseline="central" fill="#A07830" fontFamily="'Cormorant Garamond',serif" fontSize="5" letterSpacing="0.5">MTS</text>
      {/* Cierre derecha */}
      <circle cx="238" cy="100" r="8" fill="none" stroke="#A07830" strokeWidth="2" />
      <circle cx="238" cy="100" r="3" fill="#A07830" />
      {/* Dije 1: corazón rojo */}
      <line x1="68" y1="104" x2="68" y2="120" stroke="#A07830" strokeWidth="1.5" />
      <circle cx="68" cy="118" r="3" fill="none" stroke="#A07830" strokeWidth="1" />
      <path d="M61 126 Q61 122 65 122 Q68 122 68 126 Q68 122 71 122 Q75 122 75 126 Q75 132 68 138 Q61 132 61 126Z" fill="#C0392B" stroke="#A07830" strokeWidth="0.8" />
      {/* Dije 2: estrella dorada */}
      <line x1="100" y1="104" x2="100" y2="122" stroke="#A07830" strokeWidth="1.5" />
      <circle cx="100" cy="120" r="3" fill="none" stroke="#A07830" strokeWidth="1" />
      <path d="M100 126 L102 133 L109 133 L103 137 L105 145 L100 140 L95 145 L97 137 L91 133 L98 133 Z" fill="#A07830" stroke="#C8A96E" strokeWidth="0.5" />
      {/* Dije 3: cruz */}
      <line x1="130" y1="104" x2="130" y2="118" stroke="#A07830" strokeWidth="1.5" />
      <circle cx="130" cy="117" r="3" fill="none" stroke="#A07830" strokeWidth="1" />
      <rect x="126" y="122" width="8" height="18" rx="1" fill="white" stroke="#A07830" strokeWidth="1" />
      <rect x="122" y="128" width="16" height="6" rx="1" fill="white" stroke="#A07830" strokeWidth="1" />
      {/* Dije 4: luna */}
      <line x1="162" y1="104" x2="162" y2="120" stroke="#A07830" strokeWidth="1.5" />
      <circle cx="162" cy="119" r="3" fill="none" stroke="#A07830" strokeWidth="1" />
      <path d="M155 130 Q155 122 162 122 Q158 126 158 133 Q158 140 162 144 Q155 144 155 136 Z" fill="#A07830" />
      <circle cx="167" cy="125" r="1" fill="#C8A96E" />
      <circle cx="169" cy="131" r="0.8" fill="#C8A96E" />
      <circle cx="166" cy="137" r="1" fill="#C8A96E" />
      {/* Dije 5: mariposa */}
      <line x1="196" y1="104" x2="196" y2="118" stroke="#A07830" strokeWidth="1.5" />
      <circle cx="196" cy="117" r="3" fill="none" stroke="#A07830" strokeWidth="1" />
      <ellipse cx="190" cy="126" rx="7" ry="5" fill="#5B8DB8" stroke="#A07830" strokeWidth="0.8" opacity="0.85" />
      <ellipse cx="202" cy="126" rx="7" ry="5" fill="#5B8DB8" stroke="#A07830" strokeWidth="0.8" opacity="0.85" />
      <ellipse cx="190" cy="133" rx="5" ry="3.5" fill="#7BA7CC" stroke="#A07830" strokeWidth="0.8" opacity="0.85" />
      <ellipse cx="202" cy="133" rx="5" ry="3.5" fill="#7BA7CC" stroke="#A07830" strokeWidth="0.8" opacity="0.85" />
      <line x1="196" y1="122" x2="196" y2="138" stroke="#A07830" strokeWidth="1.2" />
    </svg>
  )
}

export default async function Hero() {
  const heroImages = await getHeroImages()
  const hasImages = heroImages.length > 0
  return (
    <section className="grid grid-cols-2 hero-section" style={{ height: '620px' }}>

      {/* Columna izquierda */}
      <div className="flex flex-col justify-center bg-crema hero-left" style={{ padding: '64px 48px' }}>
        <div className="hero-tag">
          <span className="hero-tag-line" />
          Bañadas en oro 18k · Envío a todo Chile
        </div>

        <h1 className="font-serif text-[64px] font-light text-verde leading-[0.98] mb-3 hero-title">
          Pequeños<br />
          detalles,<br />
          <em className="text-dorado italic">grandes</em><br />
          momentos.
        </h1>

        <p className="font-serif text-[17px] italic text-verde-light mb-14 leading-[1.7] hero-subtitle">
          Pulseras y collares que cuentan tu historia.
        </p>

        <div className="flex gap-[14px] items-center">
          <Link href="/pulseras" className="hero-btn-primary">Ver colección</Link>
          <Link href="/crear-pulsera" className="hero-btn-ghost">Crea tu pulsera</Link>
        </div>
      </div>

      {/* Columna derecha */}
      <div className="bg-crema-dark flex items-center justify-center relative overflow-hidden hero-right">
        {/* Círculos decorativos (solo sin foto) */}
        {!hasImages && <>
          <div className="absolute w-[340px] h-[340px] rounded-full"
            style={{ border: '0.5px solid rgba(28,61,46,0.07)' }} />
          <div className="absolute w-[460px] h-[460px] rounded-full"
            style={{ border: '0.5px solid rgba(28,61,46,0.04)' }} />
        </>}

        {/* SVG ilustración (solo sin foto) */}
        {!hasImages && (
          <div className="flex flex-col items-center gap-5 z-10">
            <BraceletSVG />
            <div className="font-serif text-[13px] italic text-verde-light tracking-[0.1em]">
              Pulsera dorada · Bañada en oro 18k
            </div>
          </div>
        )}

        {/* Carrusel de fotos */}
        {hasImages && <HeroCarousel images={heroImages} />}

        {/* Esquina inferior */}
        <div className="absolute bottom-7 right-7 text-[9px] tracking-[0.28em] uppercase z-10" style={{ color: 'rgba(28,61,46,0.9)', background: 'rgba(245,240,232,0.55)', padding: '5px 10px', backdropFilter: 'blur(4px)' }}>
          Nueva colección 2026
        </div>
      </div>

    </section>
  )
}
