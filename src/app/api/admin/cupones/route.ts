import { createServiceClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('cupones')
    .select('id, codigo, tipo, valor, minimo_compra, usos_actuales, usos_maximos, activo')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[api/admin/cupones GET] error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
  return Response.json({ cupones: data ?? [] })
}

export async function POST(request: Request) {
  const body = await request.json()
  const { codigo, tipo, valor, minimo_compra, usos_maximos } = body

  if (!codigo || !tipo || valor == null) {
    return Response.json({ error: 'Faltan campos requeridos: codigo, tipo, valor' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const row: Record<string, unknown> = { codigo, tipo, valor, minimo_compra: minimo_compra ?? 0, activo: true }
  if (usos_maximos != null) row.usos_maximos = usos_maximos
  const { data, error } = await supabase
    .from('cupones')
    .insert(row)
    .select('id')
    .single()

  if (error) {
    console.error('[api/admin/cupones POST] error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
  return Response.json({ ok: true, id: data.id })
}

export async function PATCH(request: Request) {
  const body = await request.json()
  const { id, ...fields } = body
  if (!id) return Response.json({ error: 'id requerido' }, { status: 400 })

  const supabase = createServiceClient()
  const { error } = await supabase.from('cupones').update(fields).eq('id', id)
  if (error) {
    console.error('[api/admin/cupones PATCH] error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
  return Response.json({ ok: true })
}

export async function DELETE(request: Request) {
  const { id } = await request.json()
  if (!id) return Response.json({ error: 'id requerido' }, { status: 400 })

  const supabase = createServiceClient()
  const { error } = await supabase.from('cupones').delete().eq('id', id)
  if (error) {
    console.error('[api/admin/cupones DELETE] error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
  return Response.json({ ok: true })
}
