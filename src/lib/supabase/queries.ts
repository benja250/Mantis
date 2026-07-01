import type { Product, ProductDetail, ProductImagen, Variante } from '@/types'
import { createClient, createServiceClient } from './server'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const isValidUUID = (id: string) => UUID_RE.test(id)

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
    .select('id, slug, nombre, descripcion_corta, precio, precio_comparar, badge, material, imagen_url, preview_url, imagenes_producto(url, alt, es_principal), variantes(stock, activa)')
    .eq('categoria_id', cat.id)
    .eq('activo', true)
    .order('orden', { ascending: true })

  if (error) throw error

  console.log(`[getProductosByCategoria] slug=${slug} total=${data?.length ?? 0}`)
  if (slug === 'dijes' && data && data.length > 0) {
    data.slice(0, 3).forEach(p => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.log(`[dijes] "${p.nombre}" imagen_url=${(p as any).imagen_url ?? 'null'} preview_url=${(p as any).preview_url ?? 'null'}`)
    })
  }

  type VarianteStockRow = { stock: number; activa: boolean }
  return (data ?? []).map(p => {
    const fromJoin = imagenPrincipal((p.imagenes_producto ?? []) as ImagenRow[])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pa = p as any
    const directUrl = pa.imagen_url as string | null | undefined
    const previewUrl = pa.preview_url as string | null | undefined
    const variantes = ((p.variantes ?? []) as VarianteStockRow[]).filter(v => v.activa)
    const agotado = variantes.length > 0 && variantes.every(v => v.stock === 0)
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
      preview_url: previewUrl ?? undefined,
      agotado,
    }
  })
}

export async function getProductoBySlug(slug: string): Promise<ProductDetail | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('productos')
    .select(`
      id, slug, nombre, descripcion_corta, descripcion,
      precio, precio_comparar, badge, material, imagen_url,
      categorias(nombre, slug),
      imagenes_producto(id, url, alt, es_principal, orden),
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

  type ImagenFullRow = ImagenRow & { id?: string; orden?: number }
  const allImagenes = ((data.imagenes_producto ?? []) as ImagenFullRow[])
    .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
  const imagenes: ProductImagen[] = allImagenes.map(img => ({
    id: img.id,
    url: img.url,
    alt: img.alt ?? undefined,
    orden: img.orden ?? 0,
  }))

  const fromJoin = imagenPrincipal(allImagenes)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const directUrl = (data as any).imagen_url as string | null | undefined
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
    imagenes,
    imagen_url: fromJoin.imagen_url ?? directUrl ?? undefined,
    imagen_alt: fromJoin.imagen_alt,
  }
}

export async function getProductosDestacados(): Promise<Product[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('productos')
    .select('id, slug, nombre, descripcion_corta, precio, precio_comparar, badge, material, imagen_url, imagenes_producto(url, alt, es_principal)')
    .eq('activo', true)
    .eq('destacado', true)
    .order('orden', { ascending: true })
    .limit(6)

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
      imagen_url: fromJoin.imagen_url ?? directUrl ?? undefined,
      imagen_alt: fromJoin.imagen_alt,
    }
  })
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
  es_regalo?: boolean
  mensaje_regalo?: string
  regalo_de?: string
  regalo_para?: string
  items: ItemCarrito[]
}

export async function crearOrden(datos: DatosOrden): Promise<{ id: string; numero: number }> {
  const supabase = createServiceClient()
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  console.log('[crearOrden] service key presente:', !!serviceKey, '| items recibidos:', datos.items.length)

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
      es_regalo: datos.es_regalo ?? false,
      mensaje_regalo: datos.mensaje_regalo ?? null,
      regalo_de: datos.regalo_de ?? null,
      regalo_para: datos.regalo_para ?? null,
    })
    .select('id, numero')
    .single()

  if (ordenError) throw ordenError

  const { error: itemsError } = await supabase
    .from('orden_items')
    .insert(datos.items.map(item => ({
      orden_id: orden.id,
      producto_id: isValidUUID(item.product.id) ? item.product.id : null,
      nombre: item.product.nombre,
      variante: item.variante ?? null,
      precio: item.product.precio,
      cantidad: item.cantidad,
      subtotal: item.product.precio * item.cantidad,
    })))

  if (itemsError) {
    console.error('[crearOrden] ❌ error insertando orden_items:', itemsError)
    throw itemsError
  }
  console.log('[crearOrden] ✅ orden_items insertados OK')

  // ── Decrementar stock de variantes ──────────────────────────────────────────
  const todosItems = datos.items.map(i => ({ id: i.product.id, nombre: i.product.nombre, variante: i.variante, esUUID: isValidUUID(i.product.id) }))
  console.log('[crearOrden] items totales:', JSON.stringify(todosItems))

  const itemsConStock = datos.items.filter(
    item => isValidUUID(item.product.id) && item.variante
  )
  console.log('[crearOrden] items para descuento stock:', itemsConStock.length, itemsConStock.map(i => ({ id: i.product.id, variante: i.variante })))

  if (itemsConStock.length > 0) {
    const variantesActuales = await Promise.all(
      itemsConStock.map(item =>
        supabase
          .from('variantes')
          .select('id, stock')
          .eq('producto_id', item.product.id)
          .eq('nombre', item.variante as string)
          .single()
      )
    )
    console.log('[crearOrden] variantes encontradas:', variantesActuales.map(({ data: v, error: e }) => ({ stock: v?.stock, id: v?.id, error: e?.message })))

    const updateResults = await Promise.all(
      variantesActuales.map(({ data: v }, i) => {
        if (!v) {
          console.warn('[crearOrden] variante no encontrada para item:', itemsConStock[i])
          return Promise.resolve({ error: null })
        }
        const nuevoStock = Math.max(0, v.stock - itemsConStock[i].cantidad)
        console.log('[crearOrden] actualizando stock variante', v.id, ':', v.stock, '→', nuevoStock)
        return supabase.from('variantes').update({ stock: nuevoStock }).eq('id', v.id)
      })
    )
    updateResults.forEach(({ error }, i) => {
      if (error) console.error('[crearOrden] ❌ error actualizando stock:', itemsConStock[i]?.product?.nombre, error)
    })
  } else {
    console.log('[crearOrden] sin items con UUID+variante válidos — stock no se descuenta')
  }

  // ── Incrementar usos del cupón ───────────────────────────────────────────────
  if (datos.cupon_codigo) {
    const codigo = datos.cupon_codigo.toUpperCase().trim()
    const { data: cupon } = await supabase
      .from('cupones')
      .select('usos_actuales')
      .eq('codigo', codigo)
      .single()
    if (cupon) {
      await supabase
        .from('cupones')
        .update({ usos_actuales: cupon.usos_actuales + 1 })
        .eq('codigo', codigo)
    }
  }

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

// ─── Reseñas ──────────────────────────────────────────────────────────────────

export interface Resena {
  id: string
  nombre_cliente: string
  calificacion: number
  texto: string
  fecha: string
}

export async function getResenasByProducto(producto_id: string): Promise<Resena[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('resenas')
    .select('id, nombre_cliente, calificacion, texto, fecha')
    .eq('producto_id', producto_id)
    .eq('aprobada', true)
    .order('fecha', { ascending: false })
  return (data ?? []) as Resena[]
}

export async function crearResena(data: {
  producto_id: string
  nombre_cliente: string
  email: string
  texto: string
  calificacion: number
}): Promise<void> {
  const supabase = createServiceClient()
  const { error } = await supabase.from('resenas').insert({
    producto_id: data.producto_id,
    nombre_cliente: data.nombre_cliente,
    email: data.email,
    texto: data.texto,
    calificacion: data.calificacion,
    aprobada: false,
  })
  if (error) throw error
}

// ─── Newsletter ───────────────────────────────────────────────────────────────

export async function suscribirNewsletter(email: string): Promise<void> {
  const supabase = createServiceClient()
  const { error } = await supabase
    .from('suscriptores')
    .upsert(
      { email, activo: true, fecha_suscripcion: new Date().toISOString() },
      { onConflict: 'email' }
    )
  if (error) throw error
}
