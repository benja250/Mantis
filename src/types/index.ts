// Espeja la tabla `productos` de Supabase + imagen principal aplanada
export interface Product {
  id: string
  slug: string
  nombre: string
  descripcion_corta: string
  precio: number          // CLP entero, ej: 18990
  precio_comparar?: number
  material?: string
  badge?: string
  badge_variant?: 'default' | 'outline'
  imagen_url?: string
  imagen_alt?: string
  categoria?: string
  categoria_slug?: string
  agotado?: boolean       // true cuando todas las variantes tienen stock = 0
}

export interface CartItemDesglose {
  cadena: { nombre: string; precio: number }
  dijes: { nombre: string; precio: number }[]
}

export interface CartItem {
  product: Product
  variante?: string
  cantidad: number
  maxStock?: number
  desglose?: CartItemDesglose
}

export interface Variante {
  id: string
  nombre: string
  stock: number
}

export interface ProductImagen {
  id?: string
  url: string
  alt?: string
  orden: number
}

export interface ProductDetail extends Product {
  descripcion: string
  material: string
  variantes: Variante[]
  categoria: string
  categoria_slug: string
  imagenes?: ProductImagen[]
}
