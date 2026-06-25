import { Resend } from 'resend'
import {
  emailConfirmacion,
  emailAdmin,
  emailDespachado,
  type DatosEmailPedido,
} from './templates'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'MANTIS <onboarding@resend.dev>'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL

function numOrden(n: number) {
  return 'MAN-' + String(n).padStart(4, '0')
}

export async function enviarConfirmacionPedido(datos: DatosEmailPedido) {
  const { error } = await resend.emails.send({
    from: FROM,
    to: datos.cliente_email,
    subject: `Tu pedido Mantis fue recibido 🌿 ${numOrden(datos.numero)}`,
    html: emailConfirmacion(datos),
  })
  if (error) console.error('[email] confirmacion:', error)
}

export async function enviarNotificacionAdmin(
  datos: DatosEmailPedido & {
    cliente_telefono?: string
    direccion?: string
    ciudad?: string
    region?: string
    courier?: string
  }
) {
  if (!ADMIN_EMAIL) return
  const { error } = await resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `Nuevo pedido ${numOrden(datos.numero)} — $${datos.total.toLocaleString('es-CL')}`,
    html: emailAdmin(datos),
  })
  if (error) console.error('[email] admin:', error)
}

export async function enviarDespachado(datos: {
  numero: number
  cliente_nombre: string
  cliente_email: string
  courier?: string | null
}) {
  const { error } = await resend.emails.send({
    from: FROM,
    to: datos.cliente_email,
    subject: `Tu pedido Mantis fue despachado 📦`,
    html: emailDespachado(datos),
  })
  if (error) console.error('[email] despachado:', error)
}
