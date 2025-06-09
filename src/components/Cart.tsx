import {useState} from 'react'
import {CartItem, Product} from '@/types'
import {submitOrder} from '@/services/api'
import numeral from 'numeral'
import {isValidPhoneNumber, validateInput} from '@/utils/security'

interface CartProps {
  cart: CartItem[]
  products: Product[]
  setShowSuccessModal: (show: boolean) => void
}

const Cart = ({cart, products, setShowSuccessModal}: CartProps) => {
  const [phone, setPhone] = useState<string>('')
  const [phoneError, setPhoneError] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const totalSum = cart.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.id)
    return sum + (product ? product.price * item.quantity : 0)
  }, 0)

  const formatPhoneNumber = (value: string): string => {
    const cleaned = value.replace(/\D/g, '')
    const match = cleaned.match(
      /^7?(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/
    )

    if (!match) return value

    const [, area, first, second, third] = match

    let formatted = '+7'
    if (area) formatted += ` (${area}`
    if (first) formatted += `) ${first}`
    if (second) formatted += `-${second}`
    if (third) formatted += `-${third}`

    return formatted
  }

  const validatePhone = (phoneValue: string): string => {
    const cleanValue = validateInput(phoneValue, 20)
    const cleanPhone = cleanValue.replace(/\D/g, '')

    if (!cleanPhone) {
      return 'Введите номер телефона'
    }

    if (cleanPhone.length !== 11) {
      return 'Номер должен содержать 11 цифр'
    }

    if (!isValidPhoneNumber(phoneValue)) {
      return 'Номер должен начинаться с 7'
    }

    return ''
  }

  const handlePhoneChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value
    const cleaned = value.replace(/\D/g, '')

    if (cleaned.length <= 11) {
      const formatted = formatPhoneNumber(cleaned)
      setPhone(formatted)

      const error = validatePhone(formatted)
      setPhoneError(error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const phoneValidationError = validatePhone(phone)
    if (phoneValidationError) {
      setPhoneError(phoneValidationError)
      return
    }

    if (cart.length === 0) {
      return
    }

    try {
      setIsSubmitting(true)
      const cleanPhone = phone.replace(/\D/g, '')

      const response = await submitOrder({
        phone: cleanPhone,
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
          <label htmlFor="phone" className="block mb-1 font-medium">
            Номер телефона
          </label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={handlePhoneChange}
            placeholder="+7 (___) ___-__-__"
            className={`w-full p-3 border rounded-lg transition-colors ${
              phoneError
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-300 focus:border-blue-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-200`}
          />
          {phoneError && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {phoneError}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || cart.length === 0 || !!phoneError}
          className="w-full bg-black text-white py-3 px-4 rounded-lg disabled:bg-gray-400 cursor-pointer transition-colors hover:bg-gray-800 disabled:hover:bg-gray-400"
        >
          {isSubmitting ? 'Оформление...' : 'заказать'}
        </button>
      </form>
    </div>
  )
}

export default Cart
