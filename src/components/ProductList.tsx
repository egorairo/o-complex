import {useState, useEffect, useRef, useCallback} from 'react'
import {Product, CartItem} from '@/types'
import {getProducts} from '@/services/api'
import ProductCard from './ProductCard'

interface ProductListProps {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  updateCartItem: (item: CartItem) => void
}

const ProductList = ({
  cart,
  addToCart,
  updateCartItem,
}: ProductListProps) => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const observer = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (cart.length === 0) {
      setPage(1)
    }
  }, [cart])

  const lastProductRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1)
        }
      })

      if (node) observer.current.observe(node)
    },
    [loading, hasMore]
  )

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await getProducts(page)

        setProducts((prevProducts) => {
          return page === 1
            ? response.items
            : [...prevProducts, ...response.items]
        })

        setHasMore(
          response.items.length > 0 &&
            response.page * response.amount < response.total
        )
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [page])

  return (
    <section className="py-8">
      <h2 className="text-3xl font-bold text-center mb-8">Товары</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => {
          const cartItem = cart.find((item) => item.id === product.id)

          if (products.length === index + 1) {
            return (
              <div ref={lastProductRef} key={product.id}>
                <ProductCard
                  product={product}
                  addToCart={addToCart}
                  updateCartItem={updateCartItem}
                  cartItem={cartItem}
                />
              </div>
            )
          } else {
            return (
              <div key={product.id}>
                <ProductCard
                  product={product}
                  addToCart={addToCart}
                  updateCartItem={updateCartItem}
                  cartItem={cartItem}
                />
              </div>
            )
          }
        })}
      </div>

      {loading && (
        <div className="flex justify-center mt-8">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-2">Загрузка товаров...</p>
          </div>
        </div>
      )}
    </section>
  )
}

export default ProductList
