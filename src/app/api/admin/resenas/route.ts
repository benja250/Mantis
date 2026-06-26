import { createServiceClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const filtro = searchParams.get('filtro') ?? 'todas'

  const supabase = createServiceClient()
  let q = supabase
    .from('resenas')
    .select('id, producto_id, nombre_cliente, email, calificacion, texto, aprobada, destacada, fecha, productos(nombre)')
    .order('fecha', { ascending: false })

  if (filtro === 'pendientes') q = q.eq('aprobada', false) as typeof q
  else if (filtro === 'aprobadas') q = q.eq('aprobada', true) as typeof q

  const { data, error } = await q
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ resenas: data ?? [] })
}

export async function PATCH(request: Request) {
  const body = await request.json()
  const { id, ...fields } = body
  if (!id) return Response.json({ error: 'id requerido' }, { status: 400 })

  const supabase = createServiceClient()

  // Límite de 3 reseñas destacadas al mismo tiempo
  if (fields.destacada === true) {
    const { count } = await supabase
      .from('resenas')
      .select('id', { count: 'exact', head: true })
      .eq('destacada', true)
    if ((count ?? 0) >= 3) {
      return Response.json(
        { error: 'Máximo 3 reseñas destacadas. Quita una antes de destacar otra.' },
        { status: 400 }
      )
    }
  }

  const { error } = await supabase.from('resenas').update(fields).eq('id', id)
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ ok: true })
}

export async function DELETE(request: Request) {
  const { id } = await request.json()
  if (!id) return Response.json({ error: 'id requerido' }, { status: 400 })
  const supabase = createServiceClient()
  const { error } = await supabase.from('resenas').delete().eq('id', id)
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ ok: true })
}
