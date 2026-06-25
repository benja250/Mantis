import { createPayment, getPayUrl } from '@/lib/flow/client'
import { crearOrden, actualizarOrdenToken } from '@/lib/supabase/queries'
import { enviarConfirmacionPedido, enviarNotificacionAdmin } from '@/lib/email'

const BASE_URL = process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000'
const DEV_MODE = !process.env.FLOW_API_KEY
const USE_SUPABASE = !!process.env.NEXT_PUBLIC_SUPABASE_URL

// Fallback en memoria si Supabase no está configurado
let ordenCounter = 1000

// Serializa cualquier error (Error, PostgrestError, string, objeto) a string legible
function serializarError(err: unknown): string {
  if (!err) return 'Error desconocido'
  if (typeof err === 'string') return err
  if (err instanceof Error) return err.message
  if (typeof err === 'object') {
    const e = err as Record<string, unknown>
    // PostgrestError tiene { message, code, details, hint }
    const parts: string[] = []
    if (e.message)  parts.push(String(e.message))
    if (e.code)     parts.push(`code=${e.code}`)
    if (e.details)  parts.push(`details=${e.details}`)
    if (e.hint)     parts.push(`hint=${e.hint}`)
    return parts.length ? parts.join(' | ') : JSON.stringify(err)
  }
  return String(err)
}

export async function POST(request: Request) {
  // ── 1. Parsear body ───────────────────────────────────────────────────────
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch (err) {
    console.error('[checkout] ❌ Error al parsear JSON:', err)
    return Response.json({ error: 'Body inválido — se esperaba JSON' }, { status: 400 })
  }

  console.log('[checkout] ✅ Body recibido:', JSON.stringify({
    ...body,
    items: Array.isArray(body.items) ? `[${(body.items as unknown[]).length} items]` : body.items,
  }))

  const {
    nombre, email, telefono,
    direccion, ciudad, region, courier,
    items, subtotal, descuento, costo_despacho, total,
    cupon, es_regalo, mensaje_regalo,
  } = body

  // ── 2. Validar campos ─────────────────────────────────────────────────────
  if (!nombre || !email || !telefono || !direccion || !ciudad || !region || !courier) {
    const faltantes = ['nombre','email','telefono','direccion','ciudad','region','courier']
      .filter(k => !body[k])
    console.error('[checkout] ❌ Faltan campos:', faltantes)
    return Response.json({ error: `Faltan datos obligatorios: ${faltantes.join(', ')}` }, { status: 400 })
  }
  if (!Array.isArray(items) || items.length === 0) {
    console.error('[checkout] ❌ Items vacíos o inválidos:', items)
    return Response.json({ error: 'El carrito está vacío' }, { status: 400 })
  }

  console.log('[checkout] ✅ Validación OK. USE_SUPABASE:', USE_SUPABASE, '| DEV_MODE:', DEV_MODE)

  // ── 3. Crear orden en Supabase ────────────────────────────────────────────
  let ordenId: string | null = null
  let numeroOrden: number

  if (USE_SUPABASE) {
    console.log('[checkout] 🔄 Creando orden en Supabase...')
    try {
      const orden = await crearOrden({
        cliente_nombre: nombre as string,
        cliente_email: email as string,
        cliente_telefono: telefono as string,
        direccion: direccion as string,
        ciudad: ciudad as string,
        region: region as string,
        courier: courier as string,
        subtotal: subtotal as number,
        descuento: (descuento as number) ?? 0,
        costo_despacho: costo_despacho as number,
        total: total as number,
        cupon_codigo: (cupon as string) || undefined,
        es_regalo: (es_regalo as boolean) ?? false,
        mensaje_regalo: (mensaje_regalo as string) || undefined,
        items: items as Array<{ product: { id: string; nombre: string; precio: number }; variante?: string; cantidad: number }>,
      })
      ordenId = orden.id
      numeroOrden = orden.numero
      console.log('[checkout] ✅ Orden creada:', { id: ordenId, numero: numeroOrden })
    } catch (err) {
      const msg = serializarError(err)
      console.error('[checkout] ❌ Error al crear orden en Supabase:', msg, '| Raw:', err)
      return Response.json({ error: `Error al crear orden: ${msg}` }, { status: 500 })
    }
  } else {
    numeroOrden = ++ordenCounter
    console.log('[checkout] ⚠️  Supabase no configurado. Número de orden en memoria:', numeroOrden)
  }

  // ── 4. Normalizar items para emails ───────────────────────────────────────
  const itemsEmail = (items as Array<{ product: { nombre: string; precio: number }; variante?: string; cantidad: number }>).map(i => ({
    nombre: i.product.nombre,
    variante: i.variante ?? null,
    cantidad: i.cantidad,
    precio: i.product.precio,
    subtotal: i.product.precio * i.cantidad,
  }))

  const datosEmail = {
    numero: numeroOrden,
    cliente_nombre: nombre as string,
    cliente_email: email as string,
    cliente_telefono: telefono as string,
    direccion: direccion as string,
    ciudad: ciudad as string,
    region: region as string,
    courier: courier as string,
    items: itemsEmail,
    subtotal: subtotal as number,
    descuento: ((descuento as number) ?? 0),
    costo_despacho: costo_despacho as number,
    total: total as number,
    cupon_codigo: (cupon as string) || null,
  }

  // ── 5. Enviar emails (fire-and-forget, no bloquea la respuesta) ───────────
  console.log('[checkout] 📧 Enviando emails a:', email)
  Promise.all([
    enviarConfirmacionPedido(datosEmail),
    enviarNotificacionAdmin(datosEmail),
  ]).then(() => {
    console.log('[checkout] ✅ Emails enviados OK')
  }).catch(err => {
    console.error('[checkout] ❌ Error enviando emails:', serializarError(err))
  })

  // ── 6. Modo dev → respuesta directa sin Flow ──────────────────────────────
  if (DEV_MODE) {
    console.log('[checkout] ⚠️  DEV_MODE activo — saltando Flow')
    return Response.json({
      url: `${BASE_URL}/checkout/exito?orden=${numeroOrden}&modo=dev`,
    })
  }

  // ── 7. Llamada a Flow (producción) ────────────────────────────────────────
  console.log('[checkout] 🔄 Llamando a Flow...')
  try {
    const payment = await createPayment({
      commerceOrder: String(numeroOrden),
      subject: `Pedido MANTIS #${numeroOrden}`,
      amount: total as number,
      email: email as string,
      urlConfirmation: `${BASE_URL}/api/flow/webhook`,
      urlReturn: `${BASE_URL}/api/flow/callback`,
    })

    if (ordenId) {
      await actualizarOrdenToken(ordenId, payment.token, payment.flowOrder)
    }

    console.log('[checkout] ✅ Flow OK. Redirigiendo a pago.')
    return Response.json({ url: getPayUrl(payment.url, payment.token) })
  } catch (err) {
    const msg = serializarError(err)
    console.error('[checkout] ❌ Error en Flow:', msg, '| Raw:', err)
    return Response.json({ error: `Error al procesar pago: ${msg}` }, { status: 500 })
  }
}
