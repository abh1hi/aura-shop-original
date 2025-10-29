/*
  Extend product validations to include brand when required by backend
*/
export const productValidation = {
  validateRequired: (product) => {
    const errors = []
    const requiredFields = [
      { field: 'name', message: 'Product name is required' },
      { field: 'description', message: 'Product description is required' },
      { field: 'variants', message: 'At least one product variant is required' }
    ]
    // Optional: enforce brand if provided in payload surface
    if ('brand' in product && (!product.brand || product.brand === '')) {
      errors.push({ field: 'brand', message: 'Brand is required' })
    }
    requiredFields.forEach(({ field, message }) => {
      if (!product[field] || (Array.isArray(product[field]) && product[field].length === 0)) {
        errors.push({ field, message })
      }
    })
    return errors
  },
  validateVariants: (variants) => {
    const errors = []
    if (!Array.isArray(variants) || variants.length === 0) {
      errors.push({ field: 'variants', message: 'At least one variant is required' })
      return errors
    }
    variants.forEach((variant, index) => {
      if (!variant.sku || variant.sku.trim() === '') errors.push({ field: `variants[${index}].sku`, message: `Variant ${index + 1}: SKU is required` })
      if (!variant.price || variant.price <= 0) errors.push({ field: `variants[${index}].price`, message: `Variant ${index + 1}: Valid price is required` })
      if (variant.stock === undefined || variant.stock === null || variant.stock < 0) errors.push({ field: `variants[${index}].stock`, message: `Variant ${index + 1}: Stock must be 0 or greater` })
    })
    return errors
  },
  validateText: (value, field, minLength = 1, maxLength = 5000) => {
    const errors = []
    if (!value || value.trim().length < minLength) errors.push({ field, message: `${field} must be at least ${minLength} characters long` })
    if (value && value.length > maxLength) errors.push({ field, message: `${field} must not exceed ${maxLength} characters` })
    return errors
  },
  validateImages: (images) => {
    const errors = []
    if (!Array.isArray(images)) return errors
    images.forEach((image, index) => { if (!image.url || !image.url.trim()) errors.push({ field: `images[${index}].url`, message: `Image ${index + 1}: URL is required` }) })
    return errors
  },
  validateProduct: (product) => {
    let allErrors = []
    allErrors = allErrors.concat(productValidation.validateRequired(product))
    if (product.name) allErrors = allErrors.concat(productValidation.validateText(product.name, 'name', 2, 200))
    if (product.description) allErrors = allErrors.concat(productValidation.validateText(product.description, 'description', 10, 5000))
    if (product.variants) allErrors = allErrors.concat(productValidation.validateVariants(product.variants))
    if (product.images) allErrors = allErrors.concat(productValidation.validateImages(product.images))
    return allErrors
  }
}

export const formValidation = {
  validateEmail: (email) => { const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; if (!email) return { isValid: false, message: 'Email is required' }; if (!emailRegex.test(email)) return { isValid: false, message: 'Please enter a valid email address' }; return { isValid: true } },
  validatePhone: (phone) => { const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/; if (!phone) return { isValid: false, message: 'Phone number is required' }; if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) return { isValid: false, message: 'Please enter a valid phone number' }; return { isValid: true } },
  validatePassword: (password) => { if (!password) return { isValid: false, message: 'Password is required' }; if (password.length < 8) return { isValid: false, message: 'Password must be at least 8 characters long' }; if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) return { isValid: false, message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' }; return { isValid: true } },
  validateUrl: (url) => { try { new URL(url); return { isValid: true } } catch { return { isValid: false, message: 'Please enter a valid URL' } } }
}

export const errorUtils = {
  formatErrors: (errors) => Array.isArray(errors) ? errors.map(e => ({ field: e.field, message: e.message })) : [],
  groupErrorsByField: (errors) => { const g = {}; errors.forEach(e => { if (!g[e.field]) g[e.field] = []; g[e.field].push(e.message) }); return g },
  getFieldError: (errors, fieldName) => { const es = errors.filter(e => e.field === fieldName); return es.length > 0 ? es[0].message : null }
}

export const sanitization = {
  sanitizeText: (text) => (!text ? '' : text.trim().replace(/\s+/g, ' ')),
  sanitizeNumber: (value, def = 0) => { const n = parseFloat(value); return isNaN(n) ? def : n },
  sanitizeInteger: (value, def = 0) => { const n = parseInt(value); return isNaN(n) ? def : n },
  removeEmptyValues: (obj) => { const c = {}; Object.keys(obj).forEach(k => { if (obj[k] !== null && obj[k] !== undefined && obj[k] !== '') c[k] = obj[k] }); return c }
}

export default { productValidation, formValidation, errorUtils, sanitization }
