import { createServiceClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('productos')
    .select('id, slug, nombre, precio, precio_comparar, badge, activo, destacado, descripcion_corta, imagen_url, categorias(id, nombre, slug, orden), variantes(stock, activa)')
    .order('nombre')

  if (error) {
    console.error('[api/admin/productos GET] error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
  return Response.json({ productos: data ?? [] })
}

export async function POST(request: Request) {
  const body = await request.json()
  const { variantes, ...productoFields } = body
  console.log('[api/admin/productos POST] producto:', JSON.stringify(productoFields))
  console.log('[api/admin/productos POST] variantes:', JSON.stringify(variantes))

  const supabase = createServiceClient()
  const { data, error } = await supabase.from('productos').insert(productoFields).select('id').single()
  if (error) {
    console.error('[api/admin/productos POST] error producto:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }

  if (variantes?.length) {
    const rows = variantes.map((v: { nombre: string; stock: number }) => ({
      producto_id: data.id,
      nombre: v.nombre,
      stock: v.stock,
      activa: true,
    }))
    const { error: errVar } = await supabase.from('variantes').insert(rows)
    if (errVar) {
      console.error('[api/admin/productos POST] error variantes:', errVar)
      return Response.json({ error: 'Producto creado pero error al insertar variantes: ' + errVar.message }, { status: 500 })
    }
  }

  return Response.json({ ok: true, id: data.id })
}

export async function PATCH(request: Request) {
  const body = await request.json()
  const { id, ...fields } = body
  if (!id) return Response.json({ error: 'id requerido' }, { status: 400 })

  const supabase = createServiceClient()
  const { error } = await supabase.from('productos').update(fields).eq('id', id)
  if (error) {
    console.error('[api/admin/productos] error UPDATE:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
  return Response.json({ ok: true })
}

export async function DELETE(request: Request) {
  const { id } = await request.json()
  if (!id) return Response.json({ error: 'id requerido' }, { status: 400 })

  const supabase = createServiceClient()
  const { error } = await supabase.from('productos').delete().eq('id', id)
  if (error) {
    console.error('[api/admin/productos] error DELETE:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
  return Response.json({ ok: true })
}
