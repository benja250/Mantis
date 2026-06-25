import { getProductosByCategoria } from '@/lib/supabase/queries'
import CrearPulseraClient from './CrearPulseraClient'

export default async function CrearPulseraPage() {
  const dijes = await getProductosByCategoria('dijes')
  return <CrearPulseraClient dijes={dijes} />
}
