const ITEMS = [
  'Bañadas en oro 18k',
  'Pulseras · Collares',
  'Envío a todo Chile',
  'Garantía por defectos de fabricación',
  'Pequeños detalles, grandes momentos',
]

const dot = <span className="text-dorado-pale opacity-70">·</span>

export default function Marquee() {
  const allItems = [...ITEMS, ...ITEMS]

  return (
    <div
      className="bg-verde overflow-hidden"
      style={{
        paddingTop: '28px',
        paddingBottom: '28px',
        borderTop: '0.5px solid rgba(28,61,46,0.1)',
        borderBottom: '0.5px solid rgba(28,61,46,0.1)',
      }}
    >
      <div className="marquee-track">
        {allItems.map((text, i) => (
          <span
            key={i}
            className="inline-block font-serif text-[18px] italic tracking-[0.08em] px-11"
            style={{ color: 'rgba(200,169,110,0.6)' }}
          >
            {text} {dot}
          </span>
        ))}
      </div>
    </div>
  )
}