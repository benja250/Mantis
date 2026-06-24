import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getProductoBySlug } from '@/lib/supabase/queries'
import ProductDetail from '@/components/productos/ProductDetail'

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

  return <ProductDetail product={product} />
}
