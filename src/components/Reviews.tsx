import {useEffect, useState} from 'react'
import {Review} from '@/types'
import {getReviews} from '@/services/api'
import {sanitizeHtml} from '@/utils/security'

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getReviews()
        setReviews(data)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        Загрузка отзывов...
      </div>
    )
  }

  return (
    <section className="py-8">
      <h2 className="text-3xl font-bold text-center mb-8">Отзывы</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-gray-100 p-6 rounded-lg shadow"
          >
            <div
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(review.text),
              }}
            />
          </div>
        ))}
      </div>
    </section>
  )
}

export default Reviews
