// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return '$' + n.toLocaleString('es-CL')
}

function numOrden(n: number) {
  return 'MAN-' + String(n).padStart(4, '0')
}

// ── Brand tokens ─────────────────────────────────────────────────────────────

const verde  = '#1C3D2E'
const crema  = '#F5F0E8'
const dorado = '#A07830'
const gris   = '#6B7280'


// ── Shared layout ─────────────────────────────────────────────────────────────

const BASE_URL = process.env.NEXT_PUBLIC_URL ?? 'https://mantisjoyas.cl'

function unsubscribeLink(email: string): string {
  const url = `${BASE_URL}/api/newsletter/desuscribir?email=${encodeURIComponent(email)}`
  return `<p style="margin:10px 0 0;font-size:10px;color:${gris};">¿No quieres recibir más emails? <a href="${url}" style="color:${gris};">Desuscribirse</a></p>`
}

function wrap(content: string, subscriberEmail?: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>MANTIS</title>
</head>
<body style="margin:0;padding:0;background:#EDE5D4;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#EDE5D4;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:${verde};padding:32px 40px;text-align:center;">
            <div style="font-size:26px;letter-spacing:0.22em;color:${crema};margin-bottom:4px;">MANTIS</div>
            <div style="font-size:9px;letter-spacing:0.34em;text-transform:uppercase;color:${dorado};opacity:0.85;">Joyas Bañadas en Oro</div>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:${crema};padding:36px 40px;">
            ${content}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#EDE5D4;padding:24px 40px;text-align:center;border-top:0.5px solid rgba(28,61,46,0.12);">
            <p style="margin:0 0 6px;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:${gris};">mantisjoyas.cl</p>
            <p style="margin:0;font-size:10px;color:${gris};">Joyas bañadas en oro · Hechas con amor en Chile</p>
            ${subscriberEmail ? unsubscribeLink(subscriberEmail) : ''}
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function h1(text: string): string {
  return `<h1 style="margin:0 0 8px;font-size:28px;font-weight:400;color:${verde};letter-spacing:0.04em;">${text}</h1>`
}

function label(text: string): string {
  return `<p style="margin:0 0 14px;font-size:9px;letter-spacing:0.26em;text-transform:uppercase;color:${dorado};">${text}</p>`
}

function divider(): string {
  return `<hr style="border:none;border-top:0.5px solid rgba(28,61,46,0.12);margin:24px 0;"/>`
}

function sectionTitle(text: string): string {
  return `<p style="margin:0 0 12px;font-size:9px;letter-spacing:0.26em;text-transform:uppercase;color:${gris};">${text}</p>`
}

// ── Email 1: Confirmación al comprador ────────────────────────────────────────

export interface ItemEmail {
  nombre: string
  variante?: string | null
  cantidad: number
  precio: number
  subtotal: number
}

export interface DatosEmailPedido {
  numero: number
  cliente_nombre: string
  cliente_email: string
  items: ItemEmail[]
  subtotal: number
  descuento: number
  costo_despacho: number
  total: number
  cupon_codigo?: string | null
}

export function emailConfirmacion(d: DatosEmailPedido): string {
  const itemsHtml = d.items.map(item => `
    <tr>
      <td style="padding:10px 0;border-bottom:0.5px solid rgba(28,61,46,0.08);vertical-align:top;">
        <div style="font-size:14px;color:${verde};">${item.nombre}</div>
        ${item.variante ? `<div style="font-size:11px;color:${gris};margin-top:2px;">${item.variante}</div>` : ''}
      </td>
      <td style="padding:10px 0;border-bottom:0.5px solid rgba(28,61,46,0.08);text-align:center;font-size:13px;color:${gris};">×${item.cantidad}</td>
      <td style="padding:10px 0;border-bottom:0.5px solid rgba(28,61,46,0.08);text-align:right;font-size:14px;color:${dorado};">${fmt(item.subtotal)}</td>
    </tr>`).join('')

  const descuentoRow = d.descuento > 0
    ? `<tr><td style="padding:5px 0;font-size:12px;color:${gris};">Descuento${d.cupon_codigo ? ` (${d.cupon_codigo})` : ''}</td><td style="padding:5px 0;text-align:right;font-size:12px;color:#2e7d32;">−${fmt(d.descuento)}</td></tr>`
    : ''

  const content = `
    ${h1('Tu pedido fue recibido 🌿')}
    ${label(numOrden(d.numero))}

    <p style="margin:0 0 24px;font-size:14px;color:${verde};line-height:1.8;">
      Hola ${d.cliente_nombre}, gracias por tu compra.<br/>
      Hemos recibido tu pedido y tu pago fue procesado de forma segura con Flow. Lo prepararemos con mucho cuidado.
    </p>

    ${divider()}
    ${sectionTitle('Resumen del pedido')}

    <table width="100%" cellpadding="0" cellspacing="0">
      <thead>
        <tr>
          <th style="font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:${gris};font-weight:400;padding-bottom:8px;text-align:left;border-bottom:0.5px solid rgba(28,61,46,0.15);">Producto</th>
          <th style="font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:${gris};font-weight:400;padding-bottom:8px;text-align:center;border-bottom:0.5px solid rgba(28,61,46,0.15);">Cant.</th>
          <th style="font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:${gris};font-weight:400;padding-bottom:8px;text-align:right;border-bottom:0.5px solid rgba(28,61,46,0.15);">Total</th>
        </tr>
      </thead>
      <tbody>${itemsHtml}</tbody>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">
      <tr><td style="padding:5px 0;font-size:12px;color:${gris};">Subtotal</td><td style="padding:5px 0;text-align:right;font-size:12px;color:${gris};">${fmt(d.subtotal)}</td></tr>
      ${descuentoRow}
      <tr><td style="padding:5px 0;font-size:12px;color:${gris};">Despacho</td><td style="padding:5px 0;text-align:right;font-size:12px;color:${gris};">${d.costo_despacho === 0 ? 'Gratis' : fmt(d.costo_despacho)}</td></tr>
      <tr>
        <td style="padding:14px 0 5px;font-size:16px;color:${verde};border-top:0.5px solid rgba(28,61,46,0.15);">Total a pagar</td>
        <td style="padding:14px 0 5px;text-align:right;font-size:20px;color:${dorado};border-top:0.5px solid rgba(28,61,46,0.15);">${fmt(d.total)}</td>
      </tr>
    </table>

    ${divider()}
    ${sectionTitle('Pago procesado con Flow')}

    <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(28,61,46,0.04);border-left:2px solid ${dorado};padding:20px 24px;margin-bottom:16px;">
      <tr><td style="padding:4px 24px 4px 0;font-size:11px;color:${gris};">Método de pago</td><td style="padding:4px 0;font-size:13px;color:${verde};">Flow — tarjeta de crédito, débito o RedCompra</td></tr>
      <tr><td style="padding:10px 24px 4px 0;font-size:11px;color:${gris};">Total pagado</td><td style="padding:10px 0 4px;font-size:17px;color:${dorado};font-weight:400;">${fmt(d.total)}</td></tr>
    </table>

    <p style="margin:0;font-size:12px;color:${gris};line-height:1.8;">
      Tu pago fue procesado de forma segura. Comenzaremos a preparar tu pedido de inmediato.
    </p>
  `
  return wrap(content)
}

// ── Email 2: Notificación a administradora ────────────────────────────────────

export function emailAdmin(d: DatosEmailPedido & { cliente_telefono?: string; direccion?: string; ciudad?: string; region?: string; courier?: string }): string {
  const itemsHtml = d.items.map(item => `
    <tr>
      <td style="padding:8px 12px;border-bottom:0.5px solid rgba(28,61,46,0.08);font-size:13px;color:${verde};">
        ${item.nombre}${item.variante ? ` <span style="color:${gris};font-size:11px;">· ${item.variante}</span>` : ''}
      </td>
      <td style="padding:8px 12px;border-bottom:0.5px solid rgba(28,61,46,0.08);font-size:13px;color:${gris};text-align:center;">×${item.cantidad}</td>
      <td style="padding:8px 12px;border-bottom:0.5px solid rgba(28,61,46,0.08);font-size:13px;color:${dorado};text-align:right;">${fmt(item.subtotal)}</td>
    </tr>`).join('')

  const content = `
    ${h1(`Nuevo pedido ${numOrden(d.numero)}`)}
    ${label(fmt(d.total) + ' · Pago con Flow')}

    ${divider()}
    ${sectionTitle('Cliente')}

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr><td style="padding:4px 20px 4px 0;font-size:11px;color:${gris};width:110px;">Nombre</td><td style="padding:4px 0;font-size:13px;color:${verde};">${d.cliente_nombre}</td></tr>
      <tr><td style="padding:4px 20px 4px 0;font-size:11px;color:${gris};">Email</td><td style="padding:4px 0;font-size:13px;color:${verde};">${d.cliente_email}</td></tr>
      ${d.cliente_telefono ? `<tr><td style="padding:4px 20px 4px 0;font-size:11px;color:${gris};">Teléfono</td><td style="padding:4px 0;font-size:13px;color:${verde};">${d.cliente_telefono}</td></tr>` : ''}
      ${d.direccion ? `<tr><td style="padding:4px 20px 4px 0;font-size:11px;color:${gris};">Dirección</td><td style="padding:4px 0;font-size:13px;color:${verde};">${d.direccion}${d.ciudad ? `, ${d.ciudad}` : ''}${d.region ? ` · ${d.region}` : ''}</td></tr>` : ''}
      ${d.courier ? `<tr><td style="padding:4px 20px 4px 0;font-size:11px;color:${gris};">Courier</td><td style="padding:4px 0;font-size:13px;color:${verde};">${d.courier}</td></tr>` : ''}
    </table>

    ${sectionTitle('Productos')}

    <table width="100%" cellpadding="0" cellspacing="0" style="border:0.5px solid rgba(28,61,46,0.1);">
      <thead>
        <tr style="background:rgba(28,61,46,0.04);">
          <th style="padding:8px 12px;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:${gris};font-weight:400;text-align:left;">Producto</th>
          <th style="padding:8px 12px;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:${gris};font-weight:400;text-align:center;">Cant.</th>
          <th style="padding:8px 12px;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:${gris};font-weight:400;text-align:right;">Subtotal</th>
        </tr>
      </thead>
      <tbody>${itemsHtml}</tbody>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;border-top:0.5px solid rgba(28,61,46,0.1);padding-top:12px;">
      ${d.descuento > 0 ? `<tr><td style="padding:4px 0;font-size:12px;color:${gris};">Descuento${d.cupon_codigo ? ` (${d.cupon_codigo})` : ''}</td><td style="padding:4px 0;text-align:right;font-size:12px;color:#2e7d32;">−${fmt(d.descuento)}</td></tr>` : ''}
      <tr><td style="padding:4px 0;font-size:12px;color:${gris};">Despacho</td><td style="padding:4px 0;text-align:right;font-size:12px;color:${gris};">${d.costo_despacho === 0 ? 'Gratis' : fmt(d.costo_despacho)}</td></tr>
      <tr><td style="padding:10px 0 4px;font-size:15px;color:${verde};">Total</td><td style="padding:10px 0 4px;text-align:right;font-size:20px;color:${dorado};">${fmt(d.total)}</td></tr>
    </table>

    ${divider()}

    <p style="margin:0;text-align:center;">
      <a href="${process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000'}/admin" style="display:inline-block;background:${verde};color:${crema};padding:10px 24px;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;text-decoration:none;">Ver en el panel →</a>
    </p>
  `
  return wrap(content)
}

// ── Email 3: Solicitud de reseña ─────────────────────────────────────────────

export interface ItemResena {
  nombre: string
  slug: string
}

export function emailSolicitudResena(d: {
  numero: number
  cliente_nombre: string
  items: ItemResena[]
}): string {
  const productosHtml = d.items.map(item => `
    <tr>
      <td style="padding:14px 0;border-bottom:0.5px solid rgba(28,61,46,0.08);">
        <div style="font-size:14px;color:${verde};margin-bottom:10px;">${item.nombre}</div>
        <a href="${BASE_URL}/producto/${item.slug}#resena"
           style="display:inline-block;background:transparent;color:${dorado};border:0.5px solid ${dorado};padding:8px 20px;font-size:9px;letter-spacing:0.22em;text-transform:uppercase;text-decoration:none;">
          Dejar reseña →
        </a>
      </td>
    </tr>`).join('')

  const content = `
    ${h1('¿Cómo llegó tu joya? ✨')}
    ${label(numOrden(d.numero))}

    <p style="margin:0 0 24px;font-size:14px;color:${verde};line-height:1.8;">
      Hola ${d.cliente_nombre}, esperamos que tu joya haya llegado perfecta y que la estés disfrutando mucho.<br/>
      Tu opinión es muy importante para nosotras — ¿nos cuentas cómo fue la experiencia?
    </p>

    ${divider()}
    ${sectionTitle('Tus joyas')}

    <table width="100%" cellpadding="0" cellspacing="0">
      <tbody>${productosHtml}</tbody>
    </table>

    ${divider()}

    <p style="margin:0;font-size:13px;color:${gris};line-height:1.8;">
      Tus reseñas ayudan a otras clientas a conocer nuestras joyas y nos motivan a seguir creando con amor.
    </p>

    <p style="margin:24px 0 0;font-size:14px;color:${verde};line-height:1.8;">
      Con cariño,<br/>
      <em>El equipo MANTIS</em>
    </p>
  `
  return wrap(content)
}

// ── Email 4: Pedido despachado ────────────────────────────────────────────────

export function emailDespachado(d: { numero: number; cliente_nombre: string; courier?: string | null }): string {
  const content = `
    ${h1('Tu pedido está en camino 📦')}
    ${label(numOrden(d.numero))}

    <p style="margin:0 0 24px;font-size:14px;color:${verde};line-height:1.8;">
      Hola ${d.cliente_nombre}, tu pedido ha sido despachado y pronto llegará a tu puerta.<br/>
      Gracias por confiar en MANTIS — cada pieza fue preparada con mucho cariño.
    </p>

    ${divider()}

    ${d.courier ? `
      ${sectionTitle('Detalles del despacho')}
      <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(28,61,46,0.04);border-left:2px solid ${dorado};padding:20px 24px;margin-bottom:24px;">
        <tr><td style="padding:4px 24px 4px 0;font-size:11px;color:${gris};">Courier</td><td style="padding:4px 0;font-size:14px;color:${verde};">${d.courier}</td></tr>
      </table>
    ` : ''}

    <p style="margin:0 0 8px;font-size:13px;color:${gris};line-height:1.8;">
      Si tienes alguna consulta sobre tu envío, puedes responder este email y te ayudaremos.
    </p>

    <p style="margin:24px 0 0;font-size:14px;color:${verde};line-height:1.8;">
      Con amor,<br/>
      <em>El equipo MANTIS</em>
    </p>
  `
  return wrap(content)
}
