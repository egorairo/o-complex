import axios from 'axios'
import {
  ProductsResponse,
  Review,
  OrderRequest,
  OrderResponse,
} from '@/types'

const API_URL = 'http://o-complex.com:1337'

export const getReviews = async (): Promise<Review[]> => {
  try {
    const response = await axios.get<Review[]>(`${API_URL}/reviews`, {
      headers: {
        'content-type': 'application/json',
      },
    })
    console.log('response.data', response.data)
    return response.data
  } catch (error) {
    console.error('Ошибка при получении отзывов:', error)
    return []
  }
}

export const getProducts = async (
  page: number,
  pageSize: number = 20
): Promise<ProductsResponse> => {
  try {
    const response = await axios.get<ProductsResponse>(
      `${API_URL}/products?page=${page}&page_size=${pageSize}`,
      {
        headers: {
          'content-type': 'application/json',
        },
      }
    )
    return response.data
  } catch (error) {
    console.error('Ошибка при получении товаров:', error)
    return {page: 0, amount: 0, total: 0, items: []}
  }
}

export const submitOrder = async (
  orderData: OrderRequest
): Promise<OrderResponse> => {
  try {
    const response = await axios.post<OrderResponse>(
      `${API_URL}/order`,
      orderData,
      {
        headers: {
          'content-type': 'application/json',
        },
      }
    )
    return response.data
  } catch (error) {
    console.error('Ошибка при отправке заказа:', error)
    return {success: 0, error: 'Произошла ошибка при отправке заказа'}
  }
}
