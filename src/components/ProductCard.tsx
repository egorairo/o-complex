import {useState, useEffect} from 'react'
import {Product, CartItem} from '@/types'
import numeral from 'numeral'

interface ProductCardProps {
  product: Product
  addToCart: (item: CartItem) => void
  updateCartItem: (item: CartItem) => void
  cartItem?: CartItem
}

const ProductCard = ({
  product,
  addToCart,
  updateCartItem,
  cartItem,
}: ProductCardProps) => {
  const [quantity, setQuantity] = useState(cartItem?.quantity || 1)
  const [isInCart, setIsInCart] = useState(!!cartItem)

  useEffect(() => {
    setIsInCart(!!cartItem)
    setQuantity(cartItem?.quantity || 1)
  }, [cartItem])

  const handleAddToCart = () => {
    addToCart({id: product.id, quantity})
    setIsInCart(true)
  }

  const handleQuantityChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newQuantity = parseInt(e.target.value) || 1
    setQuantity(newQuantity)
    if (isInCart) {
      updateCartItem({id: product.id, quantity: newQuantity})
    }
  }

  const handleIncrement = () => {
    const newQuantity = quantity + 1
    setQuantity(newQuantity)
    if (isInCart) {
      updateCartItem({id: product.id, quantity: newQuantity})
    }
  }

  const handleDecrement = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1
      setQuantity(newQuantity)
      if (isInCart) {
        updateCartItem({id: product.id, quantity: newQuantity})
      }
    }
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <img
        src={product.image_url}
        alt={product.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 truncate">
          {product.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {product.description}
        </p>
        <div className="flex justify-between items-center">
          <p className="text-xl font-bold">
            {numeral(product.price).format('0,0')}₽
          </p>

          {!isInCart ? (
            <button
              onClick={handleAddToCart}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
            >
              Купить
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDecrement}
                className="bg-gray-200 px-3 py-1 rounded-l cursor-pointer"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
                className="w-12 text-center border-gray-200 border"
              />
              <button
                onClick={handleIncrement}
                className="bg-gray-200 px-3 py-1 rounded-r cursor-pointer"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductCard
