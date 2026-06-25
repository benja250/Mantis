import type { MetadataRoute } from 'next'
import { createServiceClient } from '@/lib/supabase/server'

const BASE = 'https://mantisjoyas.cl'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                    lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/pulseras`,      lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/collares`,      lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/crear-pulsera`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/nosotros`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/cuidados`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/despacho`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/faq`,           lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/privacidad`,    lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE}/seguimiento`,   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
  ]

  try {
    const supabase = createServiceClient()
    const { data } = await supabase
      .from('productos')
      .select('slug, updated_at')
      .eq('activo', true)

    const productPages: MetadataRoute.Sitemap = (data ?? []).map(p => ({
      url: `${BASE}/producto/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

    return [...staticPages, ...productPages]
  } catch {
    return staticPages
  }
}
