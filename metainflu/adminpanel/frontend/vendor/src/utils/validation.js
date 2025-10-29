/*
  File: metainflu/adminpanel/frontend/vendor/src/utils/validation.js
  Purpose: Comprehensive frontend validation utilities for vendor panel
  Ensures data integrity before API calls and provides user-friendly error messages
*/

/**
 * Product validation schema and utilities
 */
export const productValidation = {
  // Required fields validation
  validateRequired: (product) => {
    const errors = [];
    const requiredFields = [
      { field: 'name', message: 'Product name is required' },
      { field: 'description', message: 'Product description is required' },
      { field: 'variants', message: 'At least one product variant is required' }
    ];

    requiredFields.forEach(({ field, message }) => {
      if (!product[field] || (Array.isArray(product[field]) && product[field].length === 0)) {
        errors.push({ field, message });
      }
    });

    return errors;
  },

  // Variant validation
  validateVariants: (variants) => {
    const errors = [];
    
    if (!Array.isArray(variants) || variants.length === 0) {
      errors.push({ field: 'variants', message: 'At least one variant is required' });
      return errors;
    }

    variants.forEach((variant, index) => {
      // SKU validation
      if (!variant.sku || variant.sku.trim() === '') {
        errors.push({ 
          field: `variants[${index}].sku`, 
          message: `Variant ${index + 1}: SKU is required` 
        });
      }

      // Price validation
      if (!variant.price || variant.price <= 0) {
        errors.push({ 
          field: `variants[${index}].price`, 
          message: `Variant ${index + 1}: Valid price is required` 
        });
      }

      // Stock validation
      if (variant.stock === undefined || variant.stock === null || variant.stock < 0) {
        errors.push({ 
          field: `variants[${index}].stock`, 
          message: `Variant ${index + 1}: Stock must be 0 or greater` 
        });
      }
    });

    return errors;
  },

  // Text field validation
  validateText: (value, field, minLength = 1, maxLength = 5000) => {
    const errors = [];
    
    if (!value || value.trim().length < minLength) {
      errors.push({ 
        field, 
        message: `${field} must be at least ${minLength} characters long` 
      });
    }
    
    if (value && value.length > maxLength) {
      errors.push({ 
        field, 
        message: `${field} must not exceed ${maxLength} characters` 
      });
    }

    return errors;
  },

  // Image validation
  validateImages: (images) => {
    const errors = [];
    
    if (!Array.isArray(images)) {
      return errors;
    }

    images.forEach((image, index) => {
      if (!image.url || !image.url.trim()) {
        errors.push({ 
          field: `images[${index}].url`, 
          message: `Image ${index + 1}: URL is required` 
        });
      }
    });

    return errors;
  },

  // Comprehensive product validation
  validateProduct: (product) => {
    let allErrors = [];

    // Required fields
    allErrors = allErrors.concat(productValidation.validateRequired(product));

    // Name validation
    if (product.name) {
      allErrors = allErrors.concat(productValidation.validateText(product.name, 'name', 2, 200));
    }

    // Description validation
    if (product.description) {
      allErrors = allErrors.concat(productValidation.validateText(product.description, 'description', 10, 5000));
    }

    // Variants validation
    if (product.variants) {
      allErrors = allErrors.concat(productValidation.validateVariants(product.variants));
    }

    // Images validation
    if (product.images) {
      allErrors = allErrors.concat(productValidation.validateImages(product.images));
    }

    return allErrors;
  }
};

/**
 * General form validation utilities
 */
export const formValidation = {
  // Email validation
  validateEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return { isValid: false, message: 'Email is required' };
    }
    if (!emailRegex.test(email)) {
      return { isValid: false, message: 'Please enter a valid email address' };
    }
    return { isValid: true };
  },

  // Phone validation
  validatePhone: (phone) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phone) {
      return { isValid: false, message: 'Phone number is required' };
    }
    if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
      return { isValid: false, message: 'Please enter a valid phone number' };
    }
    return { isValid: true };
  },

  // Password validation
  validatePassword: (password) => {
    if (!password) {
      return { isValid: false, message: 'Password is required' };
    }
    if (password.length < 8) {
      return { isValid: false, message: 'Password must be at least 8 characters long' };
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' };
    }
    return { isValid: true };
  },

  // URL validation
  validateUrl: (url) => {
    try {
      new URL(url);
      return { isValid: true };
    } catch {
      return { isValid: false, message: 'Please enter a valid URL' };
    }
  }
};

/**
 * Error handling utilities
 */
export const errorUtils = {
  // Format validation errors for display
  formatErrors: (errors) => {
    if (!Array.isArray(errors)) return [];
    
    return errors.map(error => ({
      field: error.field,
      message: error.message
    }));
  },

  // Group errors by field
  groupErrorsByField: (errors) => {
    const grouped = {};
    errors.forEach(error => {
      if (!grouped[error.field]) {
        grouped[error.field] = [];
      }
      grouped[error.field].push(error.message);
    });
    return grouped;
  },

  // Get first error message for a field
  getFieldError: (errors, fieldName) => {
    const fieldErrors = errors.filter(error => error.field === fieldName);
    return fieldErrors.length > 0 ? fieldErrors[0].message : null;
  }
};

/**
 * Data sanitization utilities
 */
export const sanitization = {
  // Sanitize text input
  sanitizeText: (text) => {
    if (!text) return '';
    return text.trim().replace(/\s+/g, ' ');
  },

  // Sanitize number input
  sanitizeNumber: (value, defaultValue = 0) => {
    const num = parseFloat(value);
    return isNaN(num) ? defaultValue : num;
  },

  // Sanitize integer input
  sanitizeInteger: (value, defaultValue = 0) => {
    const num = parseInt(value);
    return isNaN(num) ? defaultValue : num;
  },

  // Remove empty values from object
  removeEmptyValues: (obj) => {
    const cleaned = {};
    Object.keys(obj).forEach(key => {
      if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
        cleaned[key] = obj[key];
      }
    });
    return cleaned;
  }
};

export default {
  productValidation,
  formValidation,
  errorUtils,
  sanitization
};