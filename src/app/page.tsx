import { Suspense } from 'react'
import Hero from '@/components/home/Hero'
import Stats from '@/components/home/Stats'
import ProductosDestacados from '@/components/home/ProductosDestacados'
import Marquee from '@/components/layout/Marquee'
import BrandStory from '@/components/home/BrandStory'
import DijesDestacados from '@/components/home/DijesDestacados'
import Empaque from '@/components/home/Empaque'
import Resenas from '@/components/home/Resenas'
import Newsletter from '@/components/home/Newsletter'
import { getProductosDestacados } from '@/lib/supabase/queries'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const products = await getProductosDestacados()
  return (
    <main>
      <Hero />
      <Stats />
      <ProductosDestacados products={products} />
      <DijesDestacados />
      <Empaque />
      <Suspense fallback={null}>
        <Resenas />
      </Suspense>
      <Marquee />
      <BrandStory />
      <Newsletter />
    </main>
  )
}
