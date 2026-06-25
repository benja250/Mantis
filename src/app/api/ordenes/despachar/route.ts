import { createServiceClient } from '@/lib/supabase/server'
import { enviarDespachado } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const { orden_id } = await request.json()

    if (!orden_id) {
      return Response.json({ error: 'orden_id requerido' }, { status: 400 })
    }

    const supabase = createServiceClient()
    const { data: orden, error } = await supabase
      .from('ordenes')
      .select('numero, cliente_nombre, cliente_email, courier')
      .eq('id', orden_id)
      .single()

    if (error || !orden) {
      return Response.json({ error: 'Orden no encontrada' }, { status: 404 })
    }

    await enviarDespachado({
      numero: orden.numero,
      cliente_nombre: orden.cliente_nombre,
      cliente_email: orden.cliente_email,
      courier: orden.courier,
    })

    return Response.json({ ok: true })
  } catch (err) {
    console.error('[despachar]', err)
    return Response.json({ error: 'Error interno' }, { status: 500 })
  }
}
