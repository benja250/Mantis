import type { Metadata } from 'next'
import { getProductosByCategoria } from '@/lib/supabase/queries'
import CatalogoGrid from '@/components/productos/CatalogoGrid'

export const metadata: Metadata = { title: 'Collares — MANTIS' }

export default async function CollaresPage() {
  const productos = await getProductosByCategoria('collares')

  return (
    <main>
      <div className="catalog-header" style={{
        padding: '60px 48px 36px',
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        borderBottom: '0.5px solid rgba(28,61,46,0.08)',
      }}>
        <div>
          <div style={{
            fontSize: '9px',
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: 'var(--dorado)',
            marginBottom: '10px',
          }}>
            Colección
          </div>
          <h1 style={{
            fontFamily: 'var(--ff-serif)',
            fontSize: '48px',
            fontWeight: 300,
            color: 'var(--verde)',
            lineHeight: 1,
          }}>
            Collares
          </h1>
        </div>
        <span style={{
          fontSize: '11px',
          letterSpacing: '0.14em',
          color: '#3a6b52',
        }}>
          {productos.length} productos
        </span>
      </div>

      <CatalogoGrid products={productos} />
    </main>
  )
}
