import { createServiceClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  // ── 1. Parsear body ───────────────────────────────────────────────────────
  let email: string
  try {
    const body = await request.json()
    email = body?.email
  } catch {
    return Response.json({ error: 'Body inválido' }, { status: 400 })
  }

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return Response.json({ error: 'Email inválido' }, { status: 400 })
  }

  email = email.toLowerCase().trim()
  console.log('[newsletter] Suscribiendo:', email)

  // ── 2. Verificar credenciales ─────────────────────────────────────────────
  const url  = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key  = process.env.SUPABASE_SERVICE_ROLE_KEY
  console.log('[newsletter] SUPABASE_URL:', url ? '✅ set' : '❌ MISSING')
  console.log('[newsletter] SERVICE_KEY: ', key ? '✅ set' : '❌ MISSING')

  if (!url || !key) {
    return Response.json({ error: 'Supabase no configurado' }, { status: 500 })
  }

  // ── 3. Upsert en Supabase ─────────────────────────────────────────────────
  try {
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('suscriptores')
      .upsert(
        { email, activo: true, fecha_suscripcion: new Date().toISOString() },
        { onConflict: 'email' }
      )
      .select('email, activo')
      .single()

    if (error) {
      console.error('[newsletter] ❌ Supabase error:')
      console.error('  message:', error.message)
      console.error('  code:   ', error.code)
      console.error('  details:', error.details)
      console.error('  hint:   ', error.hint)
      return Response.json(
        { error: `Supabase: ${error.message}${error.hint ? ` — ${error.hint}` : ''}` },
        { status: 500 }
      )
    }

    console.log('[newsletter] ✅ OK:', data)
    return Response.json({ ok: true })

  } catch (err) {
    console.error('[newsletter] ❌ Excepción inesperada:', err)
    return Response.json({ error: String(err) }, { status: 500 })
  }
}
