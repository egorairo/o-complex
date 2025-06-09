import {useState} from 'react'
import {CartItem, Product} from '@/types'
import {submitOrder} from '@/services/api'
import numeral from 'numeral'

interface CartProps {
  cart: CartItem[]
  products: Product[]
  setShowSuccessModal: (show: boolean) => void
}

const Cart = ({cart, products, setShowSuccessModal}: CartProps) => {
  const [phone, setPhone] = useState<string>('')
  const [phoneError, setPhoneError] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const totalSum = cart.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.id)
    return sum + (product ? product.price * item.quantity : 0)
  }, 0)

  const handlePhoneChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value.replace(/\D/g, '')
    setPhone(value)
    setPhoneError(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (phone.length !== 11) {
      setPhoneError(true)
      return
    }

    if (cart.length === 0) {
      return
    }

    try {
      setIsSubmitting(true)
      const response = await submitOrder({
        phone,
        cart,
      })

      if (response.success) {
        setShowSuccessModal(true)
      } else {
        alert(
          response.error || 'Произошла ошибка при оформлении заказа'
        )
      }
    } catch (error) {
      console.error('Ошибка при отправке заказа:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow mb-8">
      <h2 className="text-xl font-bold mb-4">Добавленные товары</h2>

      <div className="mb-4">
        {cart.map((item) => {
          const product = products.find((p) => p.id === item.id)
          if (!product) return null

          return (
            <div key={item.id} className="flex justify-between mb-2">
              <span>{product.title}</span>
              <div className="flex space-x-2">
                <span>x{item.quantity}</span>
                <span>
                  {numeral(product.price * item.quantity).format(
                    '0,0'
                  )}
                  ₽
                </span>
              </div>
            </div>
          )
        })}

        {cart.length === 0 && (
          <div className="text-gray-500 mb-2">Корзина пуста</div>
        )}

        <div className="flex justify-between font-bold mt-4">
          <span>Итого:</span>
          <span>{numeral(totalSum).format('0,0')}₽</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="phone" className="block mb-1">
            +7 (___) ___ - __ - __
          </label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={handlePhoneChange}
            placeholder="79XXXXXXXXX"
            className={`w-full p-2 border rounded ${
              phoneError ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {phoneError && (
            <p className="text-red-500 text-sm mt-1">
              Введите корректный номер телефона (11 цифр)
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || cart.length === 0}
          className="w-full bg-black text-white py-2 px-4 rounded disabled:bg-gray-400 cursor-pointer"
        >
          заказать
        </button>
      </form>
    </div>
  )
}

export default Cart
