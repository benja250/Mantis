import { validarCupon } from '@/lib/supabase/queries'

export async function POST(request: Request) {
  try {
    const { codigo, subtotal } = await request.json()

    if (!codigo || typeof subtotal !== 'number') {
      return Response.json({ error: 'Datos inválidos' }, { status: 400 })
    }

    const resultado = await validarCupon(codigo, subtotal)

    if ('error' in resultado) {
      return Response.json({ error: resultado.error }, { status: 400 })
    }

    return Response.json(resultado)

  } catch (err) {
    console.error('[cupones]', err)
    return Response.json({ error: 'Error al validar cupón' }, { status: 500 })
  }
}
