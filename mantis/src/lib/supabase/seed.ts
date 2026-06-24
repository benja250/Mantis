/**
 * MANTIS — Script de seed de productos
 *
 * Cómo usar:
 *   1. Crea .env.local con NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY
 *   2. npm install -D tsx   (solo la primera vez)
 *   3. npx tsx src/lib/supabase/seed.ts
 *
 * Alternativa más simple: pega seed.sql en Supabase Dashboard → SQL Editor
 */

import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !key) {
  console.error('Faltan variables de entorno: NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const sb = createClient(url, key)

// ─── Datos ────────────────────────────────────────────────────

const CATEGORIAS = [
  { nombre: 'Pulseras', slug: 'pulseras', orden: 1, activa: true },
  { nombre: 'Collares', slug: 'collares', orden: 2, activa: true },
  { nombre: 'Dijes',    slug: 'dijes',    orden: 3, activa: true },
  { nombre: 'Kits',     slug: 'kits',     orden: 4, activa: true },
]

interface ProductoInput {
  slug: string
  nombre: string
  descripcion_corta: string
  descripcion: string
  precio: number
  material: string
  badge?: string
  destacado: boolean
  orden: number
}

interface VarianteInput {
  prod_slug: string
  nombre: string
  sku: string
  stock: number
}

const PULSERAS: ProductoInput[] = [
  {
    slug: 'pulsera-charm-dorada',
    nombre: 'Pulsera Charm Dorada',
    descripcion_corta: 'Baño oro 18k · Dije incluido · Resistente al agua',
    descripcion: 'La más querida de nuestra colección. Cadena snake bañada en oro 18k con cierre langosta y dije intercambiable incluido.',
    precio: 18990, material: 'Baño oro 18k · Resistente al agua',
    badge: 'Más vendido', destacado: true, orden: 1,
  },
  {
    slug: 'pulsera-snake-fina',
    nombre: 'Pulsera Snake Fina',
    descripcion_corta: 'Cadena snake · Baño oro 18k · Cierre langosta',
    descripcion: 'Elegancia minimalista. Cadena snake ultra fina bañada en oro 18k con cierre langosta.',
    precio: 14990, material: 'Baño oro 18k · Cierre langosta',
    destacado: false, orden: 2,
  },
  {
    slug: 'pulsera-eslabones',
    nombre: 'Pulsera Eslabones',
    descripcion_corta: 'Eslabones cuadrados · Baño oro 18k · Largo ajustable',
    descripcion: 'Tendencia statement. Eslabones bañados en oro 18k con extensión de 3 cm incluida.',
    precio: 16990, material: 'Baño oro 18k · Extensión incluida',
    badge: 'Nuevo', destacado: false, orden: 3,
  },
  {
    slug: 'pulsera-perlas-doradas',
    nombre: 'Pulsera Perlas Doradas',
    descripcion_corta: 'Perlas cultivadas · Cierres dorados · Talla única',
    descripcion: 'Delicadeza natural. Perlas cultivadas de agua dulce con cierres bañados en oro 18k.',
    precio: 12990, material: 'Perlas cultivadas · Baño oro 18k',
    destacado: false, orden: 4,
  },
  {
    slug: 'pulsera-corazon',
    nombre: 'Pulsera Corazón',
    descripcion_corta: 'Dije corazón 3D · Baño oro 18k · Cadena snake',
    descripcion: 'Un símbolo de amor propio. Cadena snake dorada con dije corazón 3D bañado en oro 18k.',
    precio: 15990, material: 'Baño oro 18k · Corazón 3D',
    destacado: false, orden: 5,
  },
  {
    slug: 'pulsera-trenzada',
    nombre: 'Pulsera Trenzada',
    descripcion_corta: 'Cadena trenzada · Baño oro 18k · Talla única',
    descripcion: 'Textura y carácter. Cadena trenzada de tres hilos bañada en oro 18k.',
    precio: 13990, material: 'Baño oro 18k · Tres hilos',
    destacado: false, orden: 6,
  },
]

const COLLARES: ProductoInput[] = [
  {
    slug: 'collar-medallon-san-benito',
    nombre: 'Collar Medallón San Benito',
    descripcion_corta: 'Medallón San Benito · Baño oro 18k · Cadena 40 cm',
    descripcion: 'Protección y estilo. Medallón San Benito con detalle grabado sobre cadena fina bañada en oro 18k.',
    precio: 16990, material: 'Baño oro 18k · Medallón grabado',
    badge: 'Más vendido', destacado: true, orden: 1,
  },
  {
    slug: 'collar-gargantilla-fina',
    nombre: 'Collar Gargantilla Fina',
    descripcion_corta: 'Gargantilla · Baño oro 18k · Largo 38 cm',
    descripcion: 'El choker dorado perfecto. Gargantilla ultra fina bañada en oro 18k que abraza el cuello.',
    precio: 13990, material: 'Baño oro 18k · Cierre langosta',
    destacado: false, orden: 2,
  },
  {
    slug: 'collar-perlas-barrocas',
    nombre: 'Collar Perlas Barrocas',
    descripcion_corta: 'Perlas barrocas · Cierres dorados · Largo 42 cm',
    descripcion: 'Lujo natural. Perlas barrocas de forma irregular con cierres bañados en oro 18k.',
    precio: 19990, material: 'Perlas barrocas · Baño oro 18k',
    badge: 'Exclusivo', destacado: false, orden: 3,
  },
  {
    slug: 'collar-estrella-norte',
    nombre: 'Collar Estrella Norte',
    descripcion_corta: 'Dije estrella · Baño oro 18k · Cadena 40 cm',
    descripcion: 'Guiada por las estrellas. Dije estrella de cinco puntas calada sobre cadena snake bañada en oro 18k.',
    precio: 14990, material: 'Baño oro 18k · Estrella calada',
    destacado: false, orden: 4,
  },
  {
    slug: 'collar-infinito',
    nombre: 'Collar Infinito',
    descripcion_corta: 'Símbolo infinito · Baño oro 18k · Cadena 40 cm',
    descripcion: 'Lo que dura para siempre. Símbolo infinito delicado sobre cadena fina bañada en oro 18k.',
    precio: 12990, material: 'Baño oro 18k · Símbolo infinito',
    destacado: false, orden: 5,
  },
  {
    slug: 'collar-corazon-cristal',
    nombre: 'Collar Corazón Cristal',
    descripcion_corta: 'Corazón con cristal · Baño oro 18k · Cadena 40 cm',
    descripcion: 'Luminosidad y amor. Colgante corazón con cristal central facetado sobre cadena snake bañada en oro 18k.',
    precio: 17990, material: 'Baño oro 18k · Cristal facetado',
    destacado: false, orden: 6,
  },
]

const DIJES: ProductoInput[] = [
  {
    slug: 'dije-corazon-rojo',
    nombre: 'Dije Corazón Rojo',
    descripcion_corta: 'Esmalte rojo · Baño oro 18k · Compatible con todas las pulseras',
    descripcion: 'Amor propio en miniatura. Dije corazón esmaltado en rojo intenso.',
    precio: 4990, material: 'Baño oro 18k · Esmalte rojo',
    destacado: false, orden: 1,
  },
  {
    slug: 'dije-estrella-dorada',
    nombre: 'Dije Estrella Dorada',
    descripcion_corta: 'Estrella 5 puntas · Baño oro 18k · Compatible con todas las pulseras',
    descripcion: 'Brilla siempre. Dije estrella de cinco puntas calada, bañada en oro 18k.',
    precio: 4990, material: 'Baño oro 18k · Estrella calada',
    destacado: false, orden: 2,
  },
  {
    slug: 'dije-1111',
    nombre: 'Dije 11:11',
    descripcion_corta: 'Números 11:11 · Baño oro 18k · Pide un deseo',
    descripcion: 'Atrapa el momento. Dije con los números 11:11 grabados en relieve.',
    precio: 5990, material: 'Baño oro 18k · Grabado en relieve',
    destacado: false, orden: 3,
  },
  {
    slug: 'dije-mariposa-azul',
    nombre: 'Dije Mariposa Azul',
    descripcion_corta: 'Esmalte azul · Baño oro 18k · Símbolo de transformación',
    descripcion: 'Libertad y cambio. Dije mariposa con esmalte azul celeste sobre base dorada.',
    precio: 5990, material: 'Baño oro 18k · Esmalte azul celeste',
    destacado: false, orden: 4,
  },
  {
    slug: 'dije-corazon-outline',
    nombre: 'Dije Corazón Outline',
    descripcion_corta: 'Corazón calado · Baño oro 18k · Delicado y minimalista',
    descripcion: 'Minimalismo con amor. Dije corazón calado sin relleno, bañado en oro 18k.',
    precio: 4990, material: 'Baño oro 18k · Calado',
    destacado: false, orden: 5,
  },
  {
    slug: 'dije-candado-dorado',
    nombre: 'Dije Candado Dorado',
    descripcion_corta: 'Candado con cerradura · Baño oro 18k · Símbolo de protección',
    descripcion: 'Protege lo que amas. Dije candado con cerradura grabada en detalle, bañado en oro 18k.',
    precio: 4990, material: 'Baño oro 18k · Grabado',
    destacado: false, orden: 6,
  },
]

const VARIANTES_PULSERAS: VarianteInput[] = [
  // Charm Dorada — 24 total (6+6+6+6)
  { prod_slug: 'pulsera-charm-dorada',   nombre: 'S — 16 cm',  sku: 'PUL-CHARM-S',  stock: 6 },
  { prod_slug: 'pulsera-charm-dorada',   nombre: 'M — 17 cm',  sku: 'PUL-CHARM-M',  stock: 6 },
  { prod_slug: 'pulsera-charm-dorada',   nombre: 'L — 18 cm',  sku: 'PUL-CHARM-L',  stock: 6 },
  { prod_slug: 'pulsera-charm-dorada',   nombre: 'XL — 19 cm', sku: 'PUL-CHARM-XL', stock: 6 },
  // Snake Fina — 8 total (2+2+2+2)
  { prod_slug: 'pulsera-snake-fina',     nombre: 'S — 16 cm',  sku: 'PUL-SNAKE-S',  stock: 2 },
  { prod_slug: 'pulsera-snake-fina',     nombre: 'M — 17 cm',  sku: 'PUL-SNAKE-M',  stock: 2 },
  { prod_slug: 'pulsera-snake-fina',     nombre: 'L — 18 cm',  sku: 'PUL-SNAKE-L',  stock: 2 },
  { prod_slug: 'pulsera-snake-fina',     nombre: 'XL — 19 cm', sku: 'PUL-SNAKE-XL', stock: 2 },
  // Eslabones — agotado (0+0+0+0)
  { prod_slug: 'pulsera-eslabones',      nombre: 'S — 16 cm',  sku: 'PUL-ESLA-S',   stock: 0 },
  { prod_slug: 'pulsera-eslabones',      nombre: 'M — 17 cm',  sku: 'PUL-ESLA-M',   stock: 0 },
  { prod_slug: 'pulsera-eslabones',      nombre: 'L — 18 cm',  sku: 'PUL-ESLA-L',   stock: 0 },
  { prod_slug: 'pulsera-eslabones',      nombre: 'XL — 19 cm', sku: 'PUL-ESLA-XL',  stock: 0 },
  // Perlas — talla única (15)
  { prod_slug: 'pulsera-perlas-doradas', nombre: 'Única',       sku: 'PUL-PERLA-U',  stock: 15 },
  // Corazón — 6 total (2+2+1+1)
  { prod_slug: 'pulsera-corazon',        nombre: 'S — 16 cm',  sku: 'PUL-CORA-S',   stock: 2 },
  { prod_slug: 'pulsera-corazon',        nombre: 'M — 17 cm',  sku: 'PUL-CORA-M',   stock: 2 },
  { prod_slug: 'pulsera-corazon',        nombre: 'L — 18 cm',  sku: 'PUL-CORA-L',   stock: 1 },
  { prod_slug: 'pulsera-corazon',        nombre: 'XL — 19 cm', sku: 'PUL-CORA-XL',  stock: 1 },
  // Trenzada — talla única (20)
  { prod_slug: 'pulsera-trenzada',       nombre: 'Única',       sku: 'PUL-TREN-U',   stock: 20 },
]

const VARIANTES_COLLARES: VarianteInput[] = [
  { prod_slug: 'collar-medallon-san-benito', nombre: 'Largo estándar — 40 cm', sku: 'COL-BENI-U', stock: 15 },
  { prod_slug: 'collar-gargantilla-fina',    nombre: 'Largo estándar — 38 cm', sku: 'COL-GARG-U', stock: 10 },
  { prod_slug: 'collar-perlas-barrocas',     nombre: 'Largo estándar — 42 cm', sku: 'COL-PERL-U', stock: 6  },
  { prod_slug: 'collar-estrella-norte',      nombre: 'Largo estándar — 40 cm', sku: 'COL-ESTR-U', stock: 0  },
  { prod_slug: 'collar-infinito',            nombre: 'Largo estándar — 40 cm', sku: 'COL-INFI-U', stock: 8  },
  { prod_slug: 'collar-corazon-cristal',     nombre: 'Largo estándar — 40 cm', sku: 'COL-CRIS-U', stock: 12 },
]

const VARIANTES_DIJES: VarianteInput[] = [
  { prod_slug: 'dije-corazon-rojo',    nombre: 'Única', sku: 'DIJ-CORA-R', stock: 20 },
  { prod_slug: 'dije-estrella-dorada', nombre: 'Única', sku: 'DIJ-ESTR-D', stock: 18 },
  { prod_slug: 'dije-1111',            nombre: 'Única', sku: 'DIJ-1111-U', stock: 15 },
  { prod_slug: 'dije-mariposa-azul',   nombre: 'Única', sku: 'DIJ-MARI-A', stock: 12 },
  { prod_slug: 'dije-corazon-outline', nombre: 'Única', sku: 'DIJ-CORA-O', stock: 20 },
  { prod_slug: 'dije-candado-dorado',  nombre: 'Única', sku: 'DIJ-CAND-D', stock: 16 },
]

// ─── Runner ───────────────────────────────────────────────────

async function getCatId(slug: string): Promise<string> {
  const { data, error } = await sb.from('categorias').select('id').eq('slug', slug).single()
  if (error || !data) throw new Error(`Categoría no encontrada: ${slug}`)
  return data.id
}

async function seedCategorias() {
  console.log('→ Categorías...')
  const { error } = await sb.from('categorias').upsert(CATEGORIAS, { onConflict: 'slug' })
  if (error) throw error
  console.log('  ✓ 4 categorías')
}

async function seedProductos(catSlug: string, productos: ProductoInput[]) {
  const catId = await getCatId(catSlug)
  const rows = productos.map(p => ({
    categoria_id: catId,
    nombre: p.nombre,
    slug: p.slug,
    descripcion_corta: p.descripcion_corta,
    descripcion: p.descripcion,
    precio: p.precio,
    material: p.material,
    badge: p.badge ?? null,
    activo: true,
    destacado: p.destacado,
    orden: p.orden,
  }))
  const { error } = await sb.from('productos').upsert(rows, { onConflict: 'slug' })
  if (error) throw error
  console.log(`  ✓ ${productos.length} productos en ${catSlug}`)
}

async function seedVariantes(variantes: VarianteInput[]) {
  // Obtener slugs únicos
  const slugs = [...new Set(variantes.map(v => v.prod_slug))]

  // Borrar variantes existentes de estos productos
  const { data: prods } = await sb.from('productos').select('id, slug').in('slug', slugs)
  if (prods && prods.length > 0) {
    const ids = prods.map(p => p.id)
    await sb.from('variantes').delete().in('producto_id', ids)
  }

  // Mapear slug → id
  const slugToId: Record<string, string> = {}
  for (const p of prods ?? []) slugToId[p.slug] = p.id

  const rows = variantes.map(v => ({
    producto_id: slugToId[v.prod_slug],
    nombre: v.nombre,
    sku: v.sku,
    stock: v.stock,
    activa: true,
  })).filter(r => r.producto_id)

  const { error } = await sb.from('variantes').insert(rows)
  if (error) throw error
  console.log(`  ✓ ${rows.length} variantes insertadas`)
}

async function seedCupon() {
  console.log('→ Cupón...')
  const { error } = await sb.from('cupones').upsert(
    { codigo: 'MANTIS10', tipo: 'porcentaje', valor: 10, minimo_compra: 15000, activo: true },
    { onConflict: 'codigo' }
  )
  if (error) throw error
  console.log('  ✓ MANTIS10 (10% off, mínimo $15.000)')
}

async function main() {
  console.log('\n🌱 MANTIS Seed\n')

  await seedCategorias()

  console.log('→ Pulseras...')
  await seedProductos('pulseras', PULSERAS)
  await seedVariantes(VARIANTES_PULSERAS)

  console.log('→ Collares...')
  await seedProductos('collares', COLLARES)
  await seedVariantes(VARIANTES_COLLARES)

  console.log('→ Dijes...')
  await seedProductos('dijes', DIJES)
  await seedVariantes(VARIANTES_DIJES)

  await seedCupon()

  console.log('\n✅ Seed completado\n')

  // Resumen
  const { data: resumen } = await sb
    .from('productos')
    .select('slug, nombre, precio, destacado, categorias(slug)')
    .eq('activo', true)
    .order('orden')

  console.log(`Total productos activos: ${resumen?.length ?? 0}`)
  console.log(`Destacados: ${resumen?.filter(p => p.destacado).length ?? 0}`)
}

main().catch(e => {
  console.error('Error en seed:', e.message)
  process.exit(1)
})
