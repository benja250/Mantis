'use client'

import { useState, type FormEvent, type ChangeEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/hooks/useCart'
import { formatPrice } from '@/lib/format'

const REGIONES = [
  'Arica y Parinacota', 'Tarapacá', 'Antofagasta', 'Atacama', 'Coquimbo',
  'Valparaíso', 'Metropolitana de Santiago', "O'Higgins", 'Maule', 'Ñuble',
  'Biobío', 'La Araucanía', 'Los Ríos', 'Los Lagos', 'Aysén', 'Magallanes',
]


const DESPACHO_RM = { courier: 'Paket', costo: 0, label: 'RM — Paket (24–48 hrs hábiles)' }
const DESPACHO_REG = { courier: 'Starken', costo: 3490, label: 'Regiones — Starken (2–8 días hábiles)' }
const GRATIS_DESDE = 30000

const MAX_MENSAJE = 150

interface Form {
  nombre: string; email: string; telefono: string
  direccion: string; ciudad: string; region: string
  courier: string
  esRegalo: boolean; mensajeRegalo: string; regaloDe: string; regaloPara: string
}

const FORM_INICIAL: Form = {
  nombre: '', email: '', telefono: '',
  direccion: '', ciudad: '', region: '',
  courier: '', esRegalo: false, mensajeRegalo: '', regaloDe: '', regaloPara: '',
}

function SectionTitle({ n, title }: { n: number; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', marginBottom: '24px' }}>
      <span style={{ fontFamily: 'var(--ff-serif)', fontSize: '28px', color: 'var(--dorado)', fontWeight: 300, lineHeight: 1 }}>{n}</span>
      <span style={{ fontFamily: 'var(--ff-serif)', fontSize: '22px', color: 'var(--verde)', fontWeight: 300 }}>{title}</span>
    </div>
  )
}

function Label({ children, error }: { children: string; error?: string }) {
  return (
    <label style={{ display: 'block', marginBottom: '6px' }}>
      <span style={{ fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: error ? '#C0392B' : '#3a6b52' }}>
        {children}{error ? ` — ${error}` : ''}
      </span>
    </label>
  )
}

function Row({ label, value, colored }: { label: string; value: string; colored?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <span style={{ fontSize: '11px', color: '#3a6b52', letterSpacing: '0.06em' }}>{label}</span>
      <span style={{ fontFamily: 'var(--ff-serif)', fontSize: '16px', color: colored ? 'var(--verde-light)' : 'var(--verde)' }}>{value}</span>
    </div>
  )
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore()
  const router = useRouter()

  const [form, setForm] = useState<Form>(FORM_INICIAL)
  const [cupon, setCupon] = useState('')
  const [descuento, setDescuento] = useState(0)
  const [cuponMsg, setCuponMsg] = useState('')
  const [errors, setErrors] = useState<Partial<Record<keyof Form | 'courier', string>>>({})
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'form' | 'pago'>('form')

  const isRM = form.region === 'Metropolitana de Santiago'
  const courier = isRM ? DESPACHO_RM : (form.region ? DESPACHO_REG : null)
  const costoEnvio = courier
    ? (totalPrice - descuento >= GRATIS_DESDE ? 0 : courier.costo)
    : 0
  const total = totalPrice - descuento + costoEnvio

  function set(field: keyof Form) {
    return (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const val = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
      setForm(prev => ({ ...prev, [field]: val }))
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  function validate(): boolean {
    const e: Partial<Record<string, string>> = {}
    if (!form.nombre.trim())       e.nombre    = 'requerido'
    if (!form.email.includes('@'))  e.email     = 'email inválido'
    if (!form.telefono.trim())     e.telefono  = 'requerido'
    if (!form.direccion.trim())    e.direccion = 'requerida'
    if (!form.ciudad.trim())       e.ciudad    = 'requerida'
    if (!form.region)              e.region    = 'selecciona una región'
    if (form.esRegalo && !form.mensajeRegalo.trim()) e.mensajeRegalo = 'escribe un mensaje'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function aplicarCupon() {
    setCuponMsg('')
    if (!cupon.trim()) return
    try {
      const res = await fetch('/api/cupones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo: cupon, subtotal: totalPrice }),
      })
      const data = await res.json()
      if (data.descuento) {
        setDescuento(data.descuento)
        setCuponMsg(`✓ Cupón aplicado — ${formatPrice(data.descuento)} de descuento`)
      } else {
        setCuponMsg(data.error ?? 'Cupón no válido')
        setDescuento(0)
      }
    } catch {
      setCuponMsg('Error al validar el cupón')
    }
  }

  function handleContinue(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setStep('pago')
    window.scrollTo(0, 0)
  }

  async function handleConfirm(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre,
          email: form.email,
          telefono: form.telefono,
          direccion: form.direccion,
          ciudad: form.ciudad,
          region: form.region,
          courier: courier?.courier ?? '',
          cupon: cupon.trim(),
          subtotal: totalPrice,
          descuento,
          costo_despacho: costoEnvio,
          total,
          es_regalo: form.esRegalo,
          mensaje_regalo: form.mensajeRegalo,
          regalo_de: form.regaloDe,
          regalo_para: form.regaloPara,
          items: items.map(i => ({
            product: { id: i.product.id, nombre: i.product.nombre, precio: i.product.precio },
            variante: i.variante,
            cantidad: i.cantidad,
          })),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Error al procesar el pedido')
      clearCart()
      router.push('/checkout/exito')
    } catch (err) {
      router.push('/checkout/error?mensaje=' + encodeURIComponent(String(err instanceof Error ? err.message : err)))
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <main style={{ padding: '80px 48px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--ff-serif)', fontSize: '24px', color: 'var(--verde)', marginBottom: '24px' }}>
          Tu carrito está vacío
        </p>
        <Link href="/pulseras" style={{
          fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase',
          color: 'var(--dorado)', textDecoration: 'none',
        }}>
          Ver colección →
        </Link>
      </main>
    )
  }

  return (
    <main>
      {/* Cabecera */}
      <div className="checkout-header" style={{
        padding: '28px 48px', borderBottom: '0.5px solid rgba(28,61,46,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: 'var(--ff-serif)', fontSize: '20px', fontWeight: 500, color: 'var(--verde)', letterSpacing: '0.14em' }}>
            MANTIS
          </span>
        </Link>
        <span style={{ fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', color: '#3a6b52' }}>
          {step === 'form' ? 'Datos de envío' : 'Pago seguro con Flow'}
        </span>
      </div>

      <div className="checkout-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 420px', minHeight: 'calc(100vh - 80px)' }}>

        {/* ── Formulario / Datos banco ── */}
        <div className="checkout-form-panel" style={{ padding: '56px 48px', borderRight: '0.5px solid rgba(28,61,46,0.08)' }}>

          {step === 'form' ? (
            <form onSubmit={handleContinue} noValidate>
              <h1 style={{ fontFamily: 'var(--ff-serif)', fontSize: '38px', fontWeight: 300, color: 'var(--verde)', marginBottom: '48px' }}>
                Finalizar compra
              </h1>

              {/* 1. Datos personales */}
              <section style={{ marginBottom: '48px' }}>
                <SectionTitle n={1} title="Datos personales" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <Label error={errors.nombre}>Nombre completo</Label>
                    <input className={`checkout-input${errors.nombre ? ' error' : ''}`}
                      value={form.nombre} onChange={set('nombre')} placeholder="María González" autoComplete="name" />
                  </div>
                  <div className="checkout-fields-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <Label error={errors.email}>Email</Label>
                      <input className={`checkout-input${errors.email ? ' error' : ''}`}
                        type="email" value={form.email} onChange={set('email')} placeholder="tu@correo.com" autoComplete="email" />
                    </div>
                    <div>
                      <Label error={errors.telefono}>Teléfono</Label>
                      <input className={`checkout-input${errors.telefono ? ' error' : ''}`}
                        type="tel" value={form.telefono} onChange={set('telefono')} placeholder="+56 9 1234 5678" autoComplete="tel" />
                    </div>
                  </div>
                </div>
              </section>

              {/* 2. Dirección */}
              <section style={{ marginBottom: '48px' }}>
                <SectionTitle n={2} title="Dirección de despacho" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <Label error={errors.direccion}>Dirección</Label>
                    <input className={`checkout-input${errors.direccion ? ' error' : ''}`}
                      value={form.direccion} onChange={set('direccion')} placeholder="Av. Providencia 1234, Depto 5" autoComplete="street-address" />
                  </div>
                  <div className="checkout-fields-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <Label error={errors.ciudad}>Ciudad</Label>
                      <input className={`checkout-input${errors.ciudad ? ' error' : ''}`}
                        value={form.ciudad} onChange={set('ciudad')} placeholder="Santiago" autoComplete="address-level2" />
                    </div>
                    <div>
                      <Label error={errors.region}>Región</Label>
                      <div style={{ position: 'relative' }}>
                        <select className={`checkout-select${errors.region ? ' error' : ''}`}
                          value={form.region} onChange={set('region')} autoComplete="address-level1">
                          <option value="">Seleccionar región</option>
                          {REGIONES.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: '10px', color: '#3a6b52' }}>▾</span>
                      </div>
                    </div>
                  </div>
                  {form.region && courier && (
                    <div style={{
                      padding: '14px 16px', background: 'var(--crema-dark)',
                      border: '0.5px solid rgba(28,61,46,0.12)',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}>
                      <span style={{ fontSize: '12px', color: 'var(--verde)' }}>{courier.label}</span>
                      <span style={{ fontFamily: 'var(--ff-serif)', fontSize: '15px', color: 'var(--dorado)' }}>
                        {costoEnvio === 0 ? 'Gratis' : formatPrice(costoEnvio)}
                      </span>
                    </div>
                  )}
                </div>
              </section>

              {/* 3. Kit regalo */}
              <section style={{ marginBottom: '48px' }}>
                <SectionTitle n={3} title="Kit regalo" />
                <label style={{
                  display: 'flex', gap: '14px', alignItems: 'flex-start',
                  cursor: 'pointer', marginBottom: form.esRegalo ? '16px' : '0',
                }}>
                  <input
                    type="checkbox"
                    checked={form.esRegalo}
                    onChange={set('esRegalo')}
                    style={{ marginTop: '3px', accentColor: 'var(--verde)' }}
                  />
                  <div>
                    <span style={{ fontSize: '13px', color: 'var(--verde)' }}>
                      Es un regalo — agregar tarjeta con mensaje
                    </span>
                    <p style={{ fontSize: '11px', color: '#3a6b52', marginTop: '3px', lineHeight: 1.6 }}>
                      El pedido llega en caja especial sin boleta visible.
                    </p>
                  </div>
                </label>
                {form.esRegalo && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '13px' }}>
                      <div>
                        <Label>De</Label>
                        <input
                          className="checkout-input"
                          value={form.regaloDe}
                          onChange={set('regaloDe')}
                          placeholder="Tu nombre"
                        />
                      </div>
                      <div>
                        <Label>Para</Label>
                        <input
                          className="checkout-input"
                          value={form.regaloPara}
                          onChange={set('regaloPara')}
                          placeholder="Nombre de quien recibe"
                        />
                      </div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                        <Label error={errors.mensajeRegalo}>Mensaje para la tarjeta</Label>
                        <span style={{ fontSize: '10px', color: form.mensajeRegalo.length >= MAX_MENSAJE ? '#C0392B' : '#3a6b52', letterSpacing: '0.06em' }}>
                          {form.mensajeRegalo.length}/{MAX_MENSAJE}
                        </span>
                      </div>
                      <textarea
                        className={`checkout-input${errors.mensajeRegalo ? ' error' : ''}`}
                        value={form.mensajeRegalo}
                        onChange={e => {
                          if (e.target.value.length <= MAX_MENSAJE) set('mensajeRegalo')(e)
                        }}
                        placeholder="Con cariño para ti..."
                        rows={3}
                        style={{ resize: 'vertical' }}
                        maxLength={MAX_MENSAJE}
                      />
                    </div>
                  </div>
                )}
              </section>

              <button type="submit" className="checkout-pay-btn" style={{
                background: 'var(--verde)', color: 'var(--crema)', border: 'none', padding: '16px',
                fontFamily: 'var(--ff-sans)', fontSize: '10px', letterSpacing: '0.28em',
                textTransform: 'uppercase', cursor: 'pointer', width: '100%',
              }}>
                Continuar al pago →
              </button>
            </form>

          ) : (
            <form onSubmit={handleConfirm} noValidate>
              <button
                type="button"
                onClick={() => setStep('form')}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase',
                  color: '#3a6b52', padding: '0 0 32px', display: 'block',
                }}
              >
                ← Volver
              </button>

              <h1 style={{ fontFamily: 'var(--ff-serif)', fontSize: '38px', fontWeight: 300, color: 'var(--verde)', marginBottom: '12px' }}>
                Confirmar y pagar
              </h1>
              <p style={{ fontSize: '13px', color: '#3a6b52', lineHeight: 1.8, marginBottom: '36px' }}>
                Serás redirigida a Flow para completar el pago de forma segura.
                Procesamos tu pedido en menos de 2 horas hábiles una vez confirmado.
              </p>

              {/* Resumen de pago con Flow */}
              <div style={{
                background: 'var(--crema-dark)', padding: '28px 32px', marginBottom: '36px',
                display: 'flex', flexDirection: 'column', gap: '16px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <rect x="1.5" y="4.5" width="15" height="10" rx="1.5" stroke="#A07830" strokeWidth="1"/>
                    <path d="M1.5 8h15" stroke="#A07830" strokeWidth="1"/>
                    <rect x="3.5" y="10.5" width="4" height="1.5" rx="0.5" fill="#A07830"/>
                  </svg>
                  <span style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#3a6b52' }}>
                    Pago seguro con Flow
                  </span>
                </div>
                <p style={{ fontSize: '11px', color: '#3a6b52', lineHeight: 1.7, margin: 0 }}>
                  Tarjeta de crédito, débito o RedCompra. Tu información de pago es procesada directamente por Flow — nunca pasa por nuestros servidores.
                </p>
                <div style={{ height: '0.5px', background: 'rgba(28,61,46,0.1)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#3a6b52' }}>
                    Total a pagar
                  </span>
                  <span style={{ fontFamily: 'var(--ff-serif)', fontSize: '22px', color: 'var(--dorado)' }}>
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="checkout-pay-btn"
                style={{
                  background: 'var(--verde)', color: 'var(--crema)', border: 'none', padding: '16px',
                  fontFamily: 'var(--ff-sans)', fontSize: '10px', letterSpacing: '0.28em',
                  textTransform: 'uppercase', cursor: loading ? 'wait' : 'pointer',
                  opacity: loading ? 0.7 : 1, width: '100%', transition: 'all 0.2s',
                }}
              >
                {loading ? 'Redirigiendo...' : `Pagar ${formatPrice(total)} con Flow →`}
              </button>

              <p style={{ marginTop: '16px', fontSize: '10px', color: '#3a6b52', textAlign: 'center', letterSpacing: '0.06em', lineHeight: 1.7 }}>
                Al confirmar recibirás un email con los detalles de tu pedido.
              </p>
            </form>
          )}
        </div>

        {/* ── Resumen ── */}
        <div className="checkout-summary" style={{ padding: '56px 36px', background: 'var(--crema-dark)', display: 'flex', flexDirection: 'column', gap: '0' }}>
          <h2 style={{ fontFamily: 'var(--ff-serif)', fontSize: '22px', fontWeight: 300, color: 'var(--verde)', marginBottom: '28px' }}>
            Tu pedido
          </h2>

          <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {items.map(({ product, variante, cantidad, desglose }) => (
              <div key={product.id + (variante ?? '')} style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                {/* Thumbnail */}
                <div style={{ width: '52px', height: '52px', background: 'var(--crema)', flexShrink: 0, overflow: 'hidden' }}>
                  {product.imagen_url
                    ? <img src={product.imagen_url} alt={product.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    : <div style={{ width: '100%', height: '100%', background: 'var(--crema)' }} />
                  }
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', color: 'var(--verde)', marginBottom: '4px' }}>{product.nombre}</div>
                  {desglose ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginBottom: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#3a6b52', letterSpacing: '0.06em' }}>
                        <span>{desglose.cadena.nombre}</span>
                        <span style={{ fontFamily: 'var(--ff-serif)', color: 'var(--dorado)' }}>{formatPrice(desglose.cadena.precio)}</span>
                      </div>
                      {desglose.dijes.map((d, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#3a6b52', letterSpacing: '0.06em' }}>
                          <span>{d.nombre}</span>
                          <span style={{ fontFamily: 'var(--ff-serif)', color: 'var(--dorado)' }}>{formatPrice(d.precio)}</span>
                        </div>
                      ))}
                    </div>
                  ) : variante && (
                    <div style={{ fontSize: '10px', color: '#3a6b52', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '2px' }}>{variante}</div>
                  )}
                  <div style={{ fontSize: '11px', color: '#3a6b52' }}>× {cantidad}</div>
                </div>
                <span style={{ fontFamily: 'var(--ff-serif)', fontSize: '15px', color: 'var(--dorado)', flexShrink: 0 }}>
                  {formatPrice(product.precio * cantidad)}
                </span>
              </div>
            ))}
          </div>

          <div style={{ height: '0.5px', background: 'rgba(28,61,46,0.1)', marginBottom: '20px' }} />

          {/* Cupón */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#3a6b52', marginBottom: '8px' }}>
              Cupón de descuento
            </div>
            <div style={{ display: 'flex' }}>
              <input
                className="checkout-input"
                value={cupon}
                onChange={e => { setCupon(e.target.value.toUpperCase()); setCuponMsg('') }}
                placeholder="MANTIS10"
                style={{ borderRight: 'none', flex: 1 }}
              />
              <button type="button" onClick={aplicarCupon} style={{
                background: 'var(--verde)', color: 'var(--crema)', border: 'none', padding: '0 18px',
                fontFamily: 'var(--ff-sans)', fontSize: '10px', letterSpacing: '0.18em',
                textTransform: 'uppercase', cursor: 'pointer', flexShrink: 0,
              }}>
                Aplicar
              </button>
            </div>
            {cuponMsg && (
              <p style={{ marginTop: '8px', fontSize: '11px', color: cuponMsg.startsWith('✓') ? '#2e5c45' : '#C0392B', letterSpacing: '0.04em' }}>
                {cuponMsg}
              </p>
            )}
          </div>

          <div style={{ height: '0.5px', background: 'rgba(28,61,46,0.1)', marginBottom: '20px' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
            <Row label="Subtotal" value={formatPrice(totalPrice)} />
            {descuento > 0 && <Row label="Descuento" value={`− ${formatPrice(descuento)}`} colored />}
            <Row
              label={courier ? `Despacho (${courier.courier})` : 'Despacho'}
              value={!courier ? '—' : costoEnvio === 0 ? 'Gratis' : formatPrice(costoEnvio)}
            />
          </div>

          <div style={{ height: '0.5px', background: 'rgba(28,61,46,0.15)', marginBottom: '20px' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '32px' }}>
            <span style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#3a6b52' }}>Total</span>
            <span style={{ fontFamily: 'var(--ff-serif)', fontSize: '30px', fontWeight: 300, color: 'var(--verde)' }}>
              {formatPrice(total)}
            </span>
          </div>

          <p style={{ fontSize: '10px', color: '#3a6b52', textAlign: 'center', letterSpacing: '0.06em', lineHeight: 1.6, marginTop: 'auto' }}>
            Pago seguro con Flow — tarjeta de crédito, débito o RedCompra<br />
            48h desde la recepción para reportar defectos de fabricación
          </p>
        </div>
      </div>
    </main>
  )
}
