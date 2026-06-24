import { suscribirNewsletter } from '@/lib/supabase/queries'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return Response.json({ error: 'Email inválido' }, { status: 400 })
    }

    await suscribirNewsletter(email.toLowerCase().trim())
    return Response.json({ ok: true })

  } catch (err) {
    console.error('[newsletter]', err)
    return Response.json({ error: 'Error al suscribir' }, { status: 500 })
  }
}
