import { createServiceClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const producto_id = searchParams.get('producto_id')
  if (!producto_id) return Response.json({ error: 'producto_id requerido' }, { status: 400 })

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('imagenes_producto')
    .select('id, url, alt, orden, es_principal')
    .eq('producto_id', producto_id)
    .order('orden')

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ imagenes: data ?? [] })
}

export async function POST(request: Request) {
  const body = await request.json()
  const { producto_id, url, orden = 0, es_principal = false, alt } = body
  if (!producto_id || !url) return Response.json({ error: 'producto_id y url requeridos' }, { status: 400 })

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('imagenes_producto')
    .insert({ producto_id, url, orden, es_principal, alt: alt ?? null })
    .select('id')
    .single()

  if (error) {
    console.error('[api/admin/imagenes POST] error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
  return Response.json({ ok: true, id: data.id })
}

export async function DELETE(request: Request) {
  const { id } = await request.json()
  if (!id) return Response.json({ error: 'id requerido' }, { status: 400 })

  const supabase = createServiceClient()
  const { error } = await supabase.from('imagenes_producto').delete().eq('id', id)
  if (error) {
    console.error('[api/admin/imagenes DELETE] error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
  return Response.json({ ok: true })
}
