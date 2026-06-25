import type { Product, ProductDetail, Variante } from '@/types'
import { createClient, createServiceClient } from './server'

// ─── Helpers ──────────────────────────────────────────────────────────────────

type ImagenRow = { url: string; alt: string | null; es_principal: boolean }

function imagenPrincipal(imagenes: ImagenRow[]): { imagen_url?: string; imagen_alt?: string } {
  const img = imagenes.find(i => i.es_principal) ?? imagenes[0]
  return img ? { imagen_url: img.url, imagen_alt: img.alt ?? undefined } : {}
}

// ─── Catálogo ─────────────────────────────────────────────────────────────────

export async function getProductosByCategoria(slug: string): Promise<Product[]> {
  const supabase = await createClient()

  const { data: cat } = await supabase
    .from('categorias')
    .select('id')
    .eq('slug', slug)
    .single()

  if (!cat) return []

  const { data, error } = await supabase
    .from('productos')
    .select('id, slug, nombre, descripcion_corta, precio, precio_comparar, badge, material, imagen_url, imagenes_producto(url, alt, es_principal)')
    .eq('categoria_id', cat.id)
    .eq('activo', true)
    .order('orden', { ascending: true })

  if (error) throw error

  return (data ?? []).map(p => {
    const fromJoin = imagenPrincipal((p.imagenes_producto ?? []) as ImagenRow[])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const directUrl = (p as any).imagen_url as string | null | undefined
    return {
      id: p.id,
      slug: p.slug,
      nombre: p.nombre,
      descripcion_corta: p.descripcion_corta,
      precio: p.precio,
      precio_comparar: p.precio_comparar ?? undefined,
      badge: p.badge ?? undefined,
      material: p.material ?? undefined,
      categoria_slug: slug,
      imagen_url: directUrl ?? fromJoin.imagen_url,
      imagen_alt: fromJoin.imagen_alt,
    }
  })
}

export async function getProductoBySlug(slug: string): Promise<ProductDetail | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('productos')
    .select(`
      id, slug, nombre, descripcion_corta, descripcion,
      precio, precio_comparar, badge, material,
      categorias(nombre, slug),
      imagenes_producto(url, alt, es_principal, orden),
      variantes(id, nombre, stock, activa)
    `)
    .eq('slug', slug)
    .eq('activo', true)
    .single()

  if (error || !data) return null

  type VarianteRow = { id: string; nombre: string; stock: number; activa: boolean }
  const variantes: Variante[] = ((data.variantes ?? []) as VarianteRow[])
    .filter(v => v.activa)
    .map(v => ({ id: v.id, nombre: v.nombre, stock: v.stock }))

  const cat = data.categorias as unknown as { nombre: string; slug: string } | null

  return {
    id: data.id,
    slug: data.slug,
    nombre: data.nombre,
    descripcion_corta: data.descripcion_corta,
    descripcion: data.descripcion ?? '',
    precio: data.precio,
    precio_comparar: data.precio_comparar ?? undefined,
    badge: data.badge ?? undefined,
    material: data.material ?? '',
    categoria: cat?.nombre ?? '',
    categoria_slug: cat?.slug ?? '',
    variantes,
    ...imagenPrincipal((data.imagenes_producto ?? []) as ImagenRow[]),
  }
}

export async function getProductosDestacados(): Promise<Product[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('productos')
    .select('id, slug, nombre, descripcion_corta, precio, precio_comparar, badge, material, imagenes_producto(url, alt, es_principal)')
    .eq('activo', true)
    .eq('destacado', true)
    .order('orden', { ascending: true })
    .limit(6)

  if (error) throw error

  return (data ?? []).map(p => ({
    id: p.id,
    slug: p.slug,
    nombre: p.nombre,
    descripcion_corta: p.descripcion_corta,
    precio: p.precio,
    precio_comparar: p.precio_comparar ?? undefined,
    badge: p.badge ?? undefined,
    material: p.material ?? undefined,
    ...imagenPrincipal((p.imagenes_producto ?? []) as ImagenRow[]),
  }))
}

// ─── Órdenes ──────────────────────────────────────────────────────────────────

interface ItemCarrito {
  product: { id: string; nombre: string; precio: number }
  variante?: string
  cantidad: number
}

export interface DatosOrden {
  cliente_nombre: string
  cliente_email: string
  cliente_telefono: string
  direccion: string
  ciudad: string
  region: string
  courier: string
  subtotal: number
  descuento: number
  costo_despacho: number
  total: number
  cupon_codigo?: string
  items: ItemCarrito[]
}

export async function crearOrden(datos: DatosOrden): Promise<{ id: string; numero: number }> {
  const supabase = createServiceClient()

  const { data: orden, error: ordenError } = await supabase
    .from('ordenes')
    .insert({
      cliente_nombre: datos.cliente_nombre,
      cliente_email: datos.cliente_email,
      cliente_telefono: datos.cliente_telefono,
      direccion: datos.direccion,
      ciudad: datos.ciudad,
      region: datos.region,
      courier: datos.courier,
      subtotal: datos.subtotal,
      descuento: datos.descuento,
      costo_despacho: datos.costo_despacho,
      total: datos.total,
      cupon_codigo: datos.cupon_codigo ?? null,
    })
    .select('id, numero')
    .single()

  if (ordenError) throw ordenError

  const { error: itemsError } = await supabase
    .from('orden_items')
    .insert(datos.items.map(item => ({
      orden_id: orden.id,
      producto_id: item.product.id,
      nombre: item.product.nombre,
      variante: item.variante ?? null,
      precio: item.product.precio,
      cantidad: item.cantidad,
      subtotal: item.product.precio * item.cantidad,
    })))

  if (itemsError) throw itemsError

  return orden
}

export async function actualizarOrdenToken(
  id: string,
  flowToken: string,
  flowOrder: number
): Promise<void> {
  const supabase = createServiceClient()
  const { error } = await supabase
    .from('ordenes')
    .update({ flow_token: flowToken, flow_order: flowOrder })
    .eq('id', id)
  if (error) console.error('[actualizarOrdenToken]', error)
}

// ─── Cupones ──────────────────────────────────────────────────────────────────

export async function validarCupon(
  codigo: string,
  subtotal: number
): Promise<{ descuento: number; cupon_id: string } | { error: string }> {
  const supabase = createServiceClient()

  const { data: cupon, error } = await supabase
    .from('cupones')
    .select('id, tipo, valor, minimo_compra, usos_maximos, usos_actuales, valido_hasta')
    .eq('codigo', codigo.toUpperCase().trim())
    .eq('activo', true)
    .single()

  if (error || !cupon) return { error: 'Cupón no encontrado o no válido' }

  if (cupon.valido_hasta && new Date(cupon.valido_hasta) < new Date()) {
    return { error: 'Este cupón ha expirado' }
  }

  if (cupon.usos_maximos !== null && cupon.usos_actuales >= cupon.usos_maximos) {
    return { error: 'Este cupón ya no tiene usos disponibles' }
  }

  if (subtotal < cupon.minimo_compra) {
    return {
      error: `Monto mínimo de compra: $${cupon.minimo_compra.toLocaleString('es-CL')}`,
    }
  }

  const descuento = cupon.tipo === 'porcentaje'
    ? Math.round(subtotal * cupon.valor / 100)
    : Math.min(cupon.valor, subtotal)

  return { descuento, cupon_id: cupon.id }
}

// ─── Newsletter ───────────────────────────────────────────────────────────────

export async function suscribirNewsletter(email: string): Promise<void> {
  const supabase = createServiceClient()
  const { error } = await supabase
    .from('suscriptores')
    .upsert({ email, activo: true }, { onConflict: 'email' })
  if (error) throw error
}
