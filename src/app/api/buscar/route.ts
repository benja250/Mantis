import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim()

  if (!q || q.length < 2) {
    return NextResponse.json({ productos: [] })
  }

  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('productos')
    .select('id, slug, nombre, precio, imagen_url, imagenes_producto(url, es_principal)')
    .eq('activo', true)
    .ilike('nombre', `%${q}%`)
    .limit(8)

  if (error) {
    return NextResponse.json({ productos: [] })
  }

  type ImgRow = { url: string; es_principal: boolean }
  const productos = (data ?? []).map(p => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const directUrl = (p as any).imagen_url as string | null
    const imgs = (p.imagenes_producto ?? []) as ImgRow[]
    const img = imgs.find(i => i.es_principal) ?? imgs[0]
    return {
      id: p.id,
      slug: p.slug,
      nombre: p.nombre,
      precio: p.precio,
      imagen_url: directUrl ?? img?.url ?? null,
    }
  })

  return NextResponse.json({ productos })
}
