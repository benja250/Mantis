// Formatea precio CLP: 18990 → "$18.990"
export function formatPrice(precio: number): string {
  return '$' + precio.toLocaleString('es-CL')
}
