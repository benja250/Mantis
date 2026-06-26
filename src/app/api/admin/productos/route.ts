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
