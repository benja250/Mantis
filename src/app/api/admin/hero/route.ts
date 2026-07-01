import { createServiceClient } from '@/lib/supabase/server'

export async function DELETE(request: Request) {
  const { name } = await request.json()
  if (!name || typeof name !== 'string') {
    return Response.json({ error: 'name requerido' }, { status: 400 })
  }
  if (!name.startsWith('hero')) {
    return Response.json({ error: 'Solo se pueden eliminar archivos hero' }, { status: 400 })
  }

  const sb = createServiceClient()
  const { error } = await sb.storage.from('productos').remove([`general/${name}`])
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ ok: true })
}
