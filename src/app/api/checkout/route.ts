import { createPayment, getPayUrl } from '@/lib/flow/client'
import { crearOrden, actualizarOrdenToken } from '@/lib/supabase/queries'
import { enviarConfirmacionPedido, enviarNotificacionAdmin } from '@/lib/email'

const BASE_URL = process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000'
const DEV_MODE = !process.env.FLOW_API_KEY
const USE_SUPABASE = !!process.env.NEXT_PUBLIC_SUPABASE_URL

// Fallback en memoria si Supabase no está configurado
let ordenCounter = 1000

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const {
      nombre, email, telefono,
      direccion, ciudad, region, courier,
      items, subtotal, descuento, costo_despacho, total,
      cupon,
    } = body

    if (!nombre || !email || !telefono || !direccion || !ciudad || !region || !courier) {
      return Response.json({ error: 'Faltan datos obligatorios' }, { status: 400 })
    }
    if (!items?.length) {
      return Response.json({ error: 'El carrito está vacío' }, { status: 400 })
    }

    // Crear orden en Supabase (o en memoria si no está configurado)
    let ordenId: string | null = null
    let numeroOrden: number

    if (USE_SUPABASE) {
      const orden = await crearOrden({
        cliente_nombre: nombre,
        cliente_email: email,
        cliente_telefono: telefono,
        direccion, ciudad, region, courier,
        subtotal,
        descuento: descuento ?? 0,
        costo_despacho,
        total,
        cupon_codigo: cupon || undefined,
        items,
      })
      ordenId = orden.id
      numeroOrden = orden.numero
    } else {
      numeroOrden = ++ordenCounter
    }

    // Normalizar items para los emails
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
      descuento: (descuento ?? 0) as number,
      costo_despacho: costo_despacho as number,
      total: total as number,
      cupon_codigo: cupon ?? null,
    }

    // Enviar emails en paralelo sin bloquear la respuesta si fallan
    Promise.all([
      enviarConfirmacionPedido(datosEmail),
      enviarNotificacionAdmin(datosEmail),
    ]).catch(err => console.error('[email] envio pedido:', err))

    // Sin credenciales Flow → modo desarrollo
    if (DEV_MODE) {
      return Response.json({
        url: `${BASE_URL}/checkout/exito?orden=${numeroOrden}&modo=dev`,
      })
    }

    // Llamada real a Flow
    const payment = await createPayment({
      commerceOrder: String(numeroOrden),
      subject: `Pedido MANTIS #${numeroOrden}`,
      amount: total,
      email,
      urlConfirmation: `${BASE_URL}/api/flow/webhook`,
      urlReturn: `${BASE_URL}/api/flow/callback`,
    })

    // Guardar token en la orden
    if (ordenId) {
      await actualizarOrdenToken(ordenId, payment.token, payment.flowOrder)
    }

    return Response.json({ url: getPayUrl(payment.url, payment.token) })

  } catch (err) {
    console.error('[checkout]', err)
    return Response.json(
      { error: err instanceof Error ? err.message : 'Error interno' },
      { status: 500 }
    )
  }
}
