import { createServiceClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const form = await request.formData()
  const file = form.get('file') as File | null
  const path = form.get('path') as string | null

  console.log('[upload] recibido — file:', file?.name, '| type:', file?.type, '| size:', file?.size, '| path:', path)

  if (!file || !path) {
    console.error('[upload] falta file o path')
    return Response.json({ error: 'file and path required' }, { status: 400 })
  }

  const ALLOWED = ['dijes/', 'dijes-preview/', 'collares/', 'pulseras/', 'anillos/', 'general/']
  if (!ALLOWED.some(prefix => path.startsWith(prefix))) {
    console.error('[upload] path no permitido:', path)
    return Response.json({ error: 'invalid path' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  console.log('[upload] buffer listo, bytes:', buffer.length)

  const sb = createServiceClient()
  console.log('[upload] subiendo a bucket "productos" en path:', path)

  const { data: uploadData, error } = await sb.storage
    .from('productos')
    .upload(path, buffer, { upsert: true, contentType: file.type })

  if (error) {
    console.error('[upload] ERROR de Supabase:', JSON.stringify(error))
    return Response.json({ error: error.message }, { status: 500 })
  }

  console.log('[upload] Supabase OK, uploadData:', JSON.stringify(uploadData))

  const { data } = sb.storage.from('productos').getPublicUrl(path)
  console.log('[upload] URL pública generada:', data.publicUrl)

  return Response.json({ url: data.publicUrl })
}
