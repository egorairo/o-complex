export interface Review {
  id: number
  text: string
}

export interface Product {
  id: number
  image_url: string
  title: string
  description: string
  price: number
}

export interface ProductsResponse {
  page: number
  amount: number
  total: number
  items: Product[]
}

export interface CartItem {
  id: number
  quantity: number
}

export interface OrderRequest {
  phone: string
  cart: CartItem[]
}

export interface OrderResponse {
  success: number
  error?: string
}
