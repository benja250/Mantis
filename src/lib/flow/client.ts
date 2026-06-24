import crypto from 'crypto'
import type { FlowPaymentParams, FlowPaymentResponse } from './types'

const API_URL = process.env.FLOW_API_URL ?? 'https://sandbox.flow.cl/api'
const API_KEY = process.env.FLOW_API_KEY ?? ''
const SECRET  = process.env.FLOW_SECRET_KEY ?? ''

// Firma los parámetros con HMAC-SHA256 según el protocolo de Flow:
// concatena claves+valores ordenadas alfabéticamente y firma el string resultante.
function sign(params: Record<string, string>): string {
  const msg = Object.keys(params).sort().map(k => k + params[k]).join('')
  return crypto.createHmac('sha256', SECRET).update(msg).digest('hex')
}

export async function createPayment(params: FlowPaymentParams): Promise<FlowPaymentResponse> {
  const raw: Record<string, string> = {
    apiKey:          API_KEY,
    commerceOrder:   params.commerceOrder,
    subject:         params.subject,
    currency:        params.currency ?? 'CLP',
    amount:          String(params.amount),
    email:           params.email,
    urlConfirmation: params.urlConfirmation,
    urlReturn:       params.urlReturn,
    paymentMethod:   String(params.paymentMethod ?? 9),
  }

  raw.s = sign(raw)

  const body = new URLSearchParams(raw)
  const res = await fetch(`${API_URL}/payment/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Flow error ${res.status}: ${text}`)
  }

  const data = await res.json()
  return data as FlowPaymentResponse
}

// URL a la que se redirige al usuario para pagar
export function getPayUrl(flowUrl: string, token: string): string {
  return `${flowUrl}/app/web/pay.php?token=${token}`
}
