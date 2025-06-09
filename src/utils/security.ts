import DOMPurify from 'dompurify'

export const sanitizeHtml = (html: string): string => {
  if (typeof window === 'undefined') {
    return html
  }

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'span', 'div'],
    ALLOWED_ATTR: ['class'],
    FORBID_TAGS: ['script', 'object', 'embed', 'iframe'],
  })
}

export const validateInput = (
  input: string,
  maxLength: number = 1000
): string => {
  if (!input || typeof input !== 'string') {
    return ''
  }

  return input.trim().slice(0, maxLength)
}

export const isValidPhoneNumber = (phone: string): boolean => {
  const cleanPhone = phone.replace(/\D/g, '')
  return cleanPhone.length === 11 && cleanPhone.startsWith('7')
}
