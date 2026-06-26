import { createServiceClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = createServiceClient()

    const { data, error } = await supabase
      .from('ordenes')
      .select('id, numero, cliente_nombre, cliente_email, cliente_telefono, direccion, ciudad, region, courier, total, subtotal, descuento, costo_despacho, cupon_codigo, es_regalo, mensaje_regalo, estado, created_at, orden_items(nombre, variante, precio, cantidad, subtotal)')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[api/admin/ordenes] error:', error)
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ ordenes: data ?? [] })
  } catch (err) {
    console.error('[api/admin/ordenes] excepción:', err)
    return Response.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  console.log('[api/admin/ordenes PATCH] handler iniciado')
  try {
    const body = await request.json()
    console.log('[api/admin/ordenes PATCH] body recibido:', body)
    const { id, estado } = body
    if (!id || !estado) return Response.json({ error: 'id y estado requeridos' }, { status: 400 })

    const supabase = createServiceClient()

    // Verificar estado actual para evitar doble restauración de stock
    const { data: ordenActual } = await supabase
      .from('ordenes')
      .select('estado')
      .eq('id', id)
      .single()

    const { error } = await supabase.from('ordenes').update({ estado }).eq('id', id)
    if (error) {
      console.error('[api/admin/ordenes PATCH] error:', error)
      return Response.json({ error: error.message }, { status: 500 })
    }

    // Restaurar stock solo si se cancela por primera vez
    if (estado === 'cancelado' && ordenActual?.estado !== 'cancelado') {
      console.log(`[ordenes PATCH] cancelando orden ${id} — buscando orden_items para restaurar stock`)

      const { data: items, error: itemsError } = await supabase
        .from('orden_items')
        .select('producto_id, variante, cantidad, nombre')
        .eq('orden_id', id)

      console.log('[ordenes PATCH] orden_items raw:', JSON.stringify(items), '| error:', itemsError?.message ?? null)

      const restorables = (items ?? []).filter(
        (i): i is { producto_id: string; variante: string; cantidad: number; nombre: string } =>
          !!i.producto_id && !!i.variante
      )

      console.log(`[ordenes PATCH] items totales: ${items?.length ?? 0} | restorables (con producto_id+variante): ${restorables.length}`)
      if ((items?.length ?? 0) > restorables.length) {
        const descartados = (items ?? []).filter(i => !i.producto_id || !i.variante)
        console.warn('[ordenes PATCH] items descartados (sin producto_id o variante):', JSON.stringify(descartados))
      }

      if (restorables.length > 0) {
        const variantesResult = await Promise.all(
          restorables.map(item =>
            supabase
              .from('variantes')
              .select('id, stock')
              .eq('producto_id', item.producto_id)
              .eq('nombre', item.variante)
              .single()
          )
        )

        console.log('[ordenes PATCH] variantes encontradas:', variantesResult.map(({ data: v, error: e }, i) => ({
          item: restorables[i].nombre,
          variante: restorables[i].variante,
          variante_id: v?.id ?? null,
          stock_actual: v?.stock ?? null,
          error: e?.message ?? null,
        })))

        const updateResults = await Promise.all(
          variantesResult.map(({ data: v }, i) => {
            if (!v) {
              console.warn(`[ordenes PATCH] variante no encontrada para "${restorables[i].nombre}" / "${restorables[i].variante}"`)
              return Promise.resolve({ error: null })
            }
            const nuevoStock = v.stock + restorables[i].cantidad
            console.log(`[ordenes PATCH] UPDATE variante ${v.id}: stock ${v.stock} → ${nuevoStock} (+${restorables[i].cantidad})`)
            return supabase.from('variantes').update({ stock: nuevoStock }).eq('id', v.id)
          })
        )

        updateResults.forEach(({ error: ue }, i) => {
          if (ue) console.error(`[ordenes PATCH] ❌ error UPDATE stock "${restorables[i].nombre}":`, ue.message)
          else console.log(`[ordenes PATCH] ✅ stock restaurado para "${restorables[i].nombre}"`)
        })
      } else {
        console.warn('[ordenes PATCH] ningún item restaurable — stock no modificado')
      }
    }

    return Response.json({ ok: true })
  } catch (err) {
    console.error('[api/admin/ordenes PATCH] excepción:', err)
    return Response.json({ error: 'Error interno' }, { status: 500 })
  }
}
