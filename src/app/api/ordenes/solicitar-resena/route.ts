import { createServiceClient } from '@/lib/supabase/server'
import { enviarSolicitudResena } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const { orden_id } = await request.json()

    if (!orden_id) {
      return Response.json({ error: 'orden_id requerido' }, { status: 400 })
    }

    const supabase = createServiceClient()

    const { data: orden, error } = await supabase
      .from('ordenes')
      .select('numero, cliente_nombre, cliente_email')
      .eq('id', orden_id)
      .single()

    if (error || !orden) {
      return Response.json({ error: 'Orden no encontrada' }, { status: 404 })
    }

    const { data: items } = await supabase
      .from('orden_items')
      .select('nombre, producto_id')
      .eq('orden_id', orden_id)
      .not('producto_id', 'is', null)

    if (!items || items.length === 0) {
      return Response.json({ ok: true })
    }

    const productoIds = [...new Set(items.map(i => i.producto_id).filter(Boolean))] as string[]

    const { data: productos } = await supabase
      .from('productos')
      .select('id, slug')
      .in('id', productoIds)

    const slugMap = new Map(productos?.map(p => [p.id, p.slug]) ?? [])

    const seen = new Set<string>()
    const itemsConSlug: Array<{ nombre: string; slug: string }> = []
    for (const item of items) {
      if (!item.producto_id || seen.has(item.producto_id)) continue
      const slug = slugMap.get(item.producto_id)
      if (slug) {
        seen.add(item.producto_id)
        itemsConSlug.push({ nombre: item.nombre, slug })
      }
    }

    if (itemsConSlug.length === 0) {
      return Response.json({ ok: true })
    }

    await enviarSolicitudResena({
      numero: orden.numero,
      cliente_nombre: orden.cliente_nombre,
      cliente_email: orden.cliente_email,
      items: itemsConSlug,
    })

    return Response.json({ ok: true })
  } catch (err) {
    console.error('[solicitar-resena]', err)
    return Response.json({ error: 'Error interno' }, { status: 500 })
  }
}
