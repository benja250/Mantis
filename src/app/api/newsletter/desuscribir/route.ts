import { createServiceClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

const BASE_URL = process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')?.toLowerCase().trim()

  if (!email || !email.includes('@')) {
    redirect(`${BASE_URL}/desuscribir?error=email`)
  }

  const supabase = createServiceClient()
  const { error } = await supabase
    .from('suscriptores')
    .update({ activo: false })
    .eq('email', email)

  if (error) {
    console.error('[desuscribir]', error.message)
    redirect(`${BASE_URL}/desuscribir?error=db`)
  }

  redirect(`${BASE_URL}/desuscribir?ok=1`)
}
