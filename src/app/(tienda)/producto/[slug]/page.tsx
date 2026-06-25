import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getProductoBySlug, getResenasByProducto } from '@/lib/supabase/queries'
import ProductDetail from '@/components/productos/ProductDetail'
import ResenasList from '@/components/productos/ResenasList'
import ResenaForm from '@/components/productos/ResenaForm'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductoBySlug(slug)
  if (!product) return {}
  return {
    title: `${product.nombre} — MANTIS`,
    description: product.descripcion_corta,
  }
}

export default async function ProductoPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductoBySlug(slug)

  if (!product) notFound()

  const resenas = await getResenasByProducto(product.id).catch(() => [])

  return (
    <>
      <ProductDetail product={product} />
      <div id="resena">
        <ResenasList resenas={resenas} />
        <ResenaForm productoId={product.id} />
      </div>
    </>
  )
}
