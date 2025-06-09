import React from 'react'

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
}

const SuccessModal = ({isOpen, onClose}: SuccessModalProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h3 className="text-2xl font-bold mb-2">
            Заказ успешно оформлен!
          </h3>
          <p className="text-gray-600 mb-6">
            Спасибо за ваш заказ. Мы свяжемся с вами в ближайшее
            время.
          </p>

          <button
            onClick={onClose}
            className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 cursor-pointer"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  )
}

export default SuccessModal
