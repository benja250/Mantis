import { NextResponse } from 'next/server'
import { crearResena } from '@/lib/supabase/queries'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { producto_id, nombre_cliente, email, texto, calificacion } = body

    if (!producto_id || !nombre_cliente || !email || !texto || !calificacion) {
      return NextResponse.json({ error: 'Todos los campos son requeridos' }, { status: 400 })
    }

    if (calificacion < 1 || calificacion > 5) {
      return NextResponse.json({ error: 'La calificación debe ser entre 1 y 5' }, { status: 400 })
    }

    if (texto.trim().length < 10) {
      return NextResponse.json({ error: 'La reseña debe tener al menos 10 caracteres' }, { status: 400 })
    }

    await crearResena({ producto_id, nombre_cliente, email, texto: texto.trim(), calificacion })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[POST /api/resenas]', err)
    return NextResponse.json({ error: 'Error al guardar la reseña' }, { status: 500 })
  }
}
