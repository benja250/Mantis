export interface FlowPaymentParams {
  commerceOrder: string   // referencia interna de la orden
  subject: string         // descripción visible al comprador
  amount: number          // total en CLP (entero)
  email: string           // email del comprador
  urlConfirmation: string // webhook server-to-server (POST)
  urlReturn: string       // redirect del browser tras el pago (GET)
  currency?: string       // "CLP" por defecto
  paymentMethod?: number  // 9 = todos los medios
}

export interface FlowPaymentResponse {
  url: string        // URL base de la página de pago Flow
  token: string      // token único de la transacción
  flowOrder: number  // número de orden en Flow
}
