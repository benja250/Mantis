import { createServiceClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const form = await request.formData()
  const file = form.get('file') as File | null
  const path = form.get('path') as string | null

  if (!file || !path) {
    return Response.json({ error: 'file and path required' }, { status: 400 })
  }

  if (!path.startsWith('dijes/') && !path.startsWith('dijes-preview/') &&
      !path.startsWith('collares/') && !path.startsWith('pulseras/') &&
      !path.startsWith('general/')) {
    return Response.json({ error: 'invalid path' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const sb = createServiceClient()
  const { error } = await sb.storage
    .from('productos')
    .upload(path, buffer, { upsert: true, contentType: file.type })

  if (error) {
    console.error('[api/admin/upload]', error)
    return Response.json({ error: error.message }, { status: 500 })
  }

  const { data } = sb.storage.from('productos').getPublicUrl(path)
  return Response.json({ url: data.publicUrl })
}
