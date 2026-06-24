import Hero from '@/components/home/Hero'
import Stats from '@/components/home/Stats'
import ProductosDestacados from '@/components/home/ProductosDestacados'
import Marquee from '@/components/layout/Marquee'
import BrandStory from '@/components/home/BrandStory'
import Empaque from '@/components/home/Empaque'
import Resenas from '@/components/home/Resenas'
import Newsletter from '@/components/home/Newsletter'

export default function Home() {
  return (
    <main>
      <Hero />
      <Stats />
      <ProductosDestacados />
      <Empaque />
      <Resenas />
      <Marquee />
      <BrandStory />
      <Newsletter />
    </main>
  )
}
