import { createServiceClient } from '@/lib/supabase/server'

export async function PATCH(request: Request) {
  const { id, stock } = await request.json()
  if (!id) return Response.json({ error: 'id requerido' }, { status: 400 })
  if (typeof stock !== 'number' || stock < 0) return Response.json({ error: 'stock inválido' }, { status: 400 })

  const supabase = createServiceClient()
  const { error } = await supabase.from('variantes').update({ stock }).eq('id', id)
  if (error) {
    console.error('[api/admin/inventario PATCH] error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
  return Response.json({ ok: true })
}
