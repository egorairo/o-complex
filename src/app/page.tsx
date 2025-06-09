'use client'

import {useState, useEffect} from 'react'
import {CartItem, Product} from '@/types'
import Reviews from '@/components/Reviews'
import ProductList from '@/components/ProductList'
import Cart from '@/components/Cart'
import SuccessModal from '@/components/SuccessModal'
import {getProducts} from '@/services/api'

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  useEffect(() => {
    const savedCart = localStorage.getItem('cart')

    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (e) {
        console.error(
          'Ошибка при загрузке корзины из localStorage:',
          e
        )
      }
    }

    const fetchInitialProducts = async () => {
      const response = await getProducts(1)
      setProducts(response.items)
    }

    fetchInitialProducts()
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (cartItem) => cartItem.id === item.id
      )

      if (existingItemIndex >= 0) {
        const updatedCart = [...prevCart]
        updatedCart[existingItemIndex].quantity = item.quantity
        return updatedCart
      } else {
        return [...prevCart, item]
      }
    })
  }

  const updateCartItem = (item: CartItem) => {
    setCart((prevCart) =>
      prevCart.map((cartItem) =>
        cartItem.id === item.id
          ? {...cartItem, quantity: item.quantity}
          : cartItem
      )
    )
  }

  const handleOrderSuccess = () => {
    setCart([])
    setShowSuccessModal(false)
    localStorage.removeItem('cart')
    localStorage.removeItem('phone')

    const resetProducts = async () => {
      const response = await getProducts(1)
      setProducts(response.items)
    }

    resetProducts()
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        Тестовое задание
      </h1>

      <Reviews />
      <div className="mb-4 md:mb-8 mt-8 md:mt-14">
        <Cart
          cart={cart}
          products={products}
          setShowSuccessModal={setShowSuccessModal}
        />
      </div>
      <ProductList
        cart={cart}
        addToCart={addToCart}
        updateCartItem={updateCartItem}
      />

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleOrderSuccess}
      />
    </main>
  )
}
