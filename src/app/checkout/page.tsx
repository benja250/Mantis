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

const DATOS_BANCO = {
  banco: 'Banco Estado',
  tipo: 'Cuenta Corriente',
  numero: '123456789',
  rut: '12.345.678-9',
  nombre: 'Mantis Joyas SpA',
  email: 'pagos@mantisjoyas.cl',
}

const DESPACHO_RM = { courier: 'Paket', costo: 0, label: 'RM — Paket (24–48 hrs hábiles)' }
const DESPACHO_REG = { courier: 'Starken', costo: 3490, label: 'Regiones — Starken (2–8 días hábiles)' }
const GRATIS_DESDE = 30000

interface Form {
  nombre: string; email: string; telefono: string
  direccion: string; ciudad: string; region: string
  courier: string
  esRegalo: boolean; mensajeRegalo: string
}

const FORM_INICIAL: Form = {
  nombre: '', email: '', telefono: '',
  direccion: '', ciudad: '', region: '',
  courier: '', esRegalo: false, mensajeRegalo: '',
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
  const [comprobante, setComprobante] = useState<File | null>(null)
  const [errors, setErrors] = useState<Partial<Record<keyof Form | 'courier' | 'comprobante', string>>>({})
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'form' | 'banco'>('form')

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

  function validateComprobante(): boolean {
    if (!comprobante) {
      setErrors(prev => ({ ...prev, comprobante: 'sube el comprobante' }))
      return false
    }
    return true
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
    setStep('banco')
    window.scrollTo(0, 0)
  }

  async function handleConfirm(e: FormEvent) {
    e.preventDefault()
    if (!validateComprobante()) return
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
      <div style={{
        padding: '28px 48px', borderBottom: '0.5px solid rgba(28,61,46,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: 'var(--ff-serif)', fontSize: '20px', fontWeight: 500, color: 'var(--verde)', letterSpacing: '0.14em' }}>
            MANTIS
          </span>
        </Link>
        <span style={{ fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', color: '#3a6b52' }}>
          {step === 'form' ? 'Datos de envío' : 'Transferencia bancaria'}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', minHeight: 'calc(100vh - 80px)' }}>

        {/* ── Formulario / Datos banco ── */}
        <div style={{ padding: '56px 48px', borderRight: '0.5px solid rgba(28,61,46,0.08)' }}>

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
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
                  <div>
                    <Label error={errors.mensajeRegalo}>Mensaje para la tarjeta</Label>
                    <textarea
                      className={`checkout-input${errors.mensajeRegalo ? ' error' : ''}`}
                      value={form.mensajeRegalo}
                      onChange={set('mensajeRegalo')}
                      placeholder="Con cariño para ti..."
                      rows={3}
                      style={{ resize: 'vertical' }}
                    />
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
                Transferencia bancaria
              </h1>
              <p style={{ fontSize: '13px', color: '#3a6b52', lineHeight: 1.8, marginBottom: '36px' }}>
                Transfiere el total a la cuenta de abajo y sube el comprobante.
                Procesamos tu pedido en menos de 2 horas hábiles.
              </p>

              {/* Datos bancarios */}
              <div style={{
                background: 'var(--crema-dark)', padding: '28px 32px', marginBottom: '36px',
                display: 'flex', flexDirection: 'column', gap: '14px',
              }}>
                {Object.entries({
                  Banco: DATOS_BANCO.banco,
                  'Tipo de cuenta': DATOS_BANCO.tipo,
                  'N° de cuenta': DATOS_BANCO.numero,
                  RUT: DATOS_BANCO.rut,
                  Nombre: DATOS_BANCO.nombre,
                  'Email comprobante': DATOS_BANCO.email,
                }).map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#3a6b52' }}>{k}</span>
                    <span style={{ fontFamily: 'var(--ff-serif)', fontSize: '15px', color: 'var(--verde)' }}>{v}</span>
                  </div>
                ))}
                <div style={{ height: '0.5px', background: 'rgba(28,61,46,0.1)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#3a6b52' }}>
                    Monto a transferir
                  </span>
                  <span style={{ fontFamily: 'var(--ff-serif)', fontSize: '22px', color: 'var(--dorado)' }}>
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* Subir comprobante */}
              <div style={{ marginBottom: '32px' }}>
                <Label error={errors.comprobante}>Comprobante de transferencia</Label>
                <label style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: '10px', padding: '32px 24px', cursor: 'pointer',
                  border: `0.5px dashed ${errors.comprobante ? 'rgba(192,57,43,0.5)' : 'rgba(28,61,46,0.25)'}`,
                  background: comprobante ? 'rgba(28,61,46,0.03)' : 'transparent',
                  transition: 'all 0.2s',
                }}>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    style={{ display: 'none' }}
                    onChange={e => {
                      setComprobante(e.target.files?.[0] ?? null)
                      setErrors(prev => ({ ...prev, comprobante: undefined }))
                    }}
                  />
                  {comprobante ? (
                    <>
                      <span style={{ fontSize: '20px' }}>✓</span>
                      <span style={{ fontSize: '12px', color: 'var(--verde)' }}>{comprobante.name}</span>
                      <span style={{ fontSize: '10px', color: '#3a6b52', letterSpacing: '0.1em' }}>
                        Clic para cambiar
                      </span>
                    </>
                  ) : (
                    <>
                      <span style={{ fontSize: '24px', opacity: 0.3 }}>↑</span>
                      <span style={{ fontSize: '12px', color: '#3a6b52', letterSpacing: '0.06em' }}>
                        Subir comprobante
                      </span>
                      <span style={{ fontSize: '10px', color: '#3a6b52', opacity: 0.6 }}>
                        JPG, PNG o PDF
                      </span>
                    </>
                  )}
                </label>
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
                {loading ? 'Enviando...' : 'Confirmar pedido →'}
              </button>

              <p style={{ marginTop: '16px', fontSize: '10px', color: '#3a6b52', textAlign: 'center', letterSpacing: '0.06em', lineHeight: 1.7 }}>
                Al confirmar recibirás un certificado de garantía por email.
              </p>
            </form>
          )}
        </div>

        {/* ── Resumen ── */}
        <div style={{ padding: '56px 36px', background: 'var(--crema-dark)', display: 'flex', flexDirection: 'column', gap: '0' }}>
          <h2 style={{ fontFamily: 'var(--ff-serif)', fontSize: '22px', fontWeight: 300, color: 'var(--verde)', marginBottom: '28px' }}>
            Tu pedido
          </h2>

          <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {items.map(({ product, variante, cantidad }) => (
              <div key={product.id + (variante ?? '')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', color: 'var(--verde)', marginBottom: '2px' }}>{product.nombre}</div>
                  {variante && (
                    <div style={{ fontSize: '10px', color: '#3a6b52', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{variante}</div>
                  )}
                  <div style={{ fontSize: '11px', color: '#3a6b52', marginTop: '2px' }}>× {cantidad}</div>
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
            Pago por transferencia bancaria<br />
            30 días de garantía por defectos de fabricación
          </p>
        </div>
      </div>
    </main>
  )
}
