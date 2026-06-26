'use client'

import { useState } from 'react'

const PREGUNTAS = [
  {
    q: '¿Cuánto demora el despacho?',
    a: 'Para la Región Metropolitana despachamos con Paket: 24–48 horas hábiles. Para regiones, usamos Starken: 2–8 días hábiles. Si compras antes de las 18:00, el pedido sale el mismo día.',
  },
  {
    q: '¿Cómo pago?',
    a: 'Por ahora aceptamos transferencia bancaria. Al confirmar tu pedido te mostramos los datos bancarios. Una vez que envías el comprobante, procesamos tu pedido.',
  },
  {
    q: '¿Puedo cambiar mi pedido?',
    a: 'Puedes solicitar cambios escribiéndonos por WhatsApp o email antes de que el pedido sea despachado. Para productos del catálogo, tienes 10 días corridos desde la recepción para ejercer tu derecho a retracto según la Ley 19.496. Las pulseras personalizadas están exentas del derecho a retracto por ser fabricadas a pedido (art. 3 bis letra b). El producto debe estar sin uso y en su empaque original. Escríbenos y lo coordinamos.',
  },
  {
    q: '¿Qué pasa si llega con defecto?',
    a: 'Tienes 48 horas desde que recibes tu pedido para reportar defectos de fabricación visibles. Escríbenos por WhatsApp o email con foto del problema y tu número de orden, y nos hacemos cargo sin costo.',
  },
  {
    q: '¿Las joyas son aptas para piel sensible?',
    a: 'Sí. El baño de oro 18k es hipoalergénico. Si tienes alergia a metales específicos, contáctanos antes de comprar para orientarte mejor.',
  },
  {
    q: '¿Puedo hacer seguimiento de mi pedido?',
    a: 'Sí. Una vez despachado recibes el número de seguimiento por email. También puedes ingresar tu número de orden en nuestra página de seguimiento.',
  },
  {
    q: '¿Puedo pedir como regalo?',
    a: 'Claro. En el checkout hay una opción de "kit regalo" donde puedes agregar un mensaje personalizado en tarjeta. El paquete no incluye boleta visible.',
  },
  {
    q: '¿Tienen tienda física?',
    a: 'Por ahora solo vendemos online. Seguimos creciendo — si quieres saber las novedades, suscríbete a nuestro newsletter o síguenos en Instagram.',
  },
  {
    q: '¿Cómo las contacto?',
    a: 'Por WhatsApp o por email a hola@mantisjoyas.cl. Respondemos de lunes a sábado en horario hábil.',
  },
]

function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '0.5px solid rgba(28,61,46,0.1)' }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%', textAlign: 'left', background: 'none', border: 'none',
          padding: '24px 0', cursor: 'pointer',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          gap: '24px',
        }}
      >
        <span style={{
          fontFamily: 'var(--ff-serif)', fontSize: '20px', fontWeight: 300,
          color: 'var(--verde)',
        }}>
          {q}
        </span>
        <span style={{
          color: 'var(--dorado)', fontSize: '18px', lineHeight: 1, flexShrink: 0,
          transform: open ? 'rotate(45deg)' : 'none',
          transition: 'transform 0.2s',
          display: 'inline-block',
        }}>
          +
        </span>
      </button>
      {open && (
        <p style={{
          fontSize: '13px', color: '#3a6b52', lineHeight: 1.9,
          paddingBottom: '24px', maxWidth: '680px',
        }}>
          {a}
        </p>
      )}
    </div>
  )
}

export default function FAQPage() {
  return (
    <main>
      <div style={{
        padding: '80px 48px 60px',
        background: 'var(--verde)',
        borderBottom: '0.5px solid rgba(245,240,232,0.08)',
      }}>
        <div style={{
          fontSize: '9px', letterSpacing: '0.32em', textTransform: 'uppercase',
          color: 'var(--dorado-pale)', marginBottom: '20px',
        }}>
          Preguntas frecuentes
        </div>
        <h1 style={{
          fontFamily: 'var(--ff-serif)', fontSize: '52px', fontWeight: 300, color: 'var(--crema)',
        }}>
          ¿En qué te podemos<br />
          <em style={{ color: 'var(--dorado-pale)', fontStyle: 'italic' }}>ayudar?</em>
        </h1>
      </div>

      <div style={{ padding: '56px 48px', maxWidth: '860px' }}>
        {PREGUNTAS.map(({ q, a }) => (
          <FAQ key={q} q={q} a={a} />
        ))}
      </div>

      <div style={{
        margin: '0 48px 72px',
        padding: '32px 36px',
        background: 'var(--crema-dark)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <p style={{ fontSize: '13px', color: 'var(--verde)', marginBottom: '4px' }}>
            ¿No encontraste lo que buscabas?
          </p>
          <p style={{ fontSize: '11px', color: '#3a6b52' }}>Escríbenos y te respondemos.</p>
        </div>
        <a
          href="https://wa.me/56900000000"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: 'var(--verde)', color: 'var(--crema)',
            padding: '12px 28px', textDecoration: 'none',
            fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase',
            fontFamily: 'var(--ff-sans)',
          }}
        >
          WhatsApp →
        </a>
      </div>
    </main>
  )
}
