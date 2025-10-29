/*
  File: metainflu/adminpanel/frontend/vendor/src/utils/debug.js
  Purpose: Debugging utilities for vendor panel development
  Helps identify data formatting issues and API call problems
*/

/**
 * Debug logging with timestamp and context
 * @param {string} context - Context of the log (e.g., 'ProductCreation', 'Validation')
 * @param {string} message - Log message
 * @param {any} data - Data to log
 */
export const debugLog = (context, message, data = null) => {
  if (process.env.NODE_ENV === 'development') {
    const timestamp = new Date().toISOString();
    console.group(`🐛 [${timestamp}] ${context}`);
    console.log(message);
    if (data !== null) {
      console.log('Data:', data);
    }
    console.groupEnd();
  }
};

/**
 * Validate product data structure before sending to API
 * @param {object} productData - Product data to validate
 * @returns {object} Validation result with issues found
 */
export const validateProductStructure = (productData) => {
  const issues = [];
  const warnings = [];
  
  // Check required fields
  if (!productData.name || productData.name.trim() === '') {
    issues.push('Product name is required');
  }
  
  if (!productData.description || productData.description.trim() === '') {
    issues.push('Product description is required');
  }
  
  // Check variants
  if (!productData.variants || !Array.isArray(productData.variants) || productData.variants.length === 0) {
    issues.push('At least one product variant is required');
  } else {
    productData.variants.forEach((variant, index) => {
      if (!variant.sku || variant.sku.trim() === '') {
        issues.push(`Variant ${index + 1}: SKU is required`);
      }
      if (!variant.price || variant.price <= 0) {
        issues.push(`Variant ${index + 1}: Price must be greater than 0`);
      }
      if (variant.stock === undefined || variant.stock === null || variant.stock < 0) {
        issues.push(`Variant ${index + 1}: Stock must be 0 or greater`);
      }
    });
  }
  
  // Check images format
  if (productData.images && Array.isArray(productData.images)) {
    productData.images.forEach((image, index) => {
      if (!image.url || image.url.trim() === '') {
        warnings.push(`Image ${index + 1}: URL is empty`);
      } else {
        try {
          new URL(image.url);
        } catch {
          warnings.push(`Image ${index + 1}: Invalid URL format`);
        }
      }
    });
  }
  
  // Check categories
  if (productData.categories && Array.isArray(productData.categories)) {
    if (productData.categories.length === 0) {
      warnings.push('No categories assigned to product');
    }
  }
  
  return {
    isValid: issues.length === 0,
    issues,
    warnings,
    summary: {
      totalIssues: issues.length,
      totalWarnings: warnings.length,
      hasRequiredFields: !!(productData.name && productData.description),
      hasVariants: !!(productData.variants && productData.variants.length > 0),
      hasImages: !!(productData.images && productData.images.length > 0),
      hasCategories: !!(productData.categories && productData.categories.length > 0)
    }
  };
};

/**
 * Compare product data before and after formatting
 * @param {object} original - Original product data
 * @param {object} formatted - Formatted product data
 */
export const compareProductData = (original, formatted) => {
  debugLog('ProductComparison', 'Comparing original vs formatted product data');
  
  console.group('📊 Original Data');
  console.log('Name:', original.name);
  console.log('Description length:', original.description?.length || 0);
  console.log('Variants count:', original.variants?.length || 0);
  console.log('Images count:', original.images?.length || 0);
  console.log('Categories:', original.categories);
  console.log('Tags:', original.tags);
  console.groupEnd();
  
  console.group('📊 Formatted Data');
  console.log('Name:', formatted.name);
  console.log('Description length:', formatted.description?.length || 0);
  console.log('Variants count:', formatted.variants?.length || 0);
  console.log('Images count:', formatted.images?.length || 0);
  console.log('Categories:', formatted.categories);
  console.log('Tags:', formatted.tags);
  console.groupEnd();
  
  // Identify key differences
  const differences = [];
  
  if (original.name !== formatted.name) {
    differences.push(`Name changed: "${original.name}" → "${formatted.name}"`);
  }
  
  if ((original.variants?.length || 0) !== (formatted.variants?.length || 0)) {
    differences.push(`Variants count: ${original.variants?.length || 0} → ${formatted.variants?.length || 0}`);
  }
  
  if ((original.images?.length || 0) !== (formatted.images?.length || 0)) {
    differences.push(`Images count: ${original.images?.length || 0} → ${formatted.images?.length || 0}`);
  }
  
  if (differences.length > 0) {
    console.group('⚠️ Key Differences');
    differences.forEach(diff => console.log(diff));
    console.groupEnd();
  }
};

/**
 * Log API request details
 * @param {string} method - HTTP method
 * @param {string} url - Request URL
 * @param {object} data - Request data
 */
export const logApiRequest = (method, url, data = null) => {
  debugLog('APIRequest', `${method} ${url}`);
  if (data) {
    console.log('Request payload:', data);
    console.log('Payload size:', JSON.stringify(data).length, 'bytes');
  }
};

/**
 * Log API response details
 * @param {Response} response - Fetch response object
 * @param {object} data - Response data
 */
export const logApiResponse = (response, data = null) => {
  const status = response.status;
  const statusText = response.statusText;
  
  if (status >= 200 && status < 300) {
    debugLog('APIResponse', `✅ ${status} ${statusText}`, data);
  } else {
    debugLog('APIResponse', `❌ ${status} ${statusText}`, data);
  }
};

/**
 * Generate a minimal test product for debugging
 * @returns {object} Minimal valid product data
 */
export const generateTestProduct = () => {
  const timestamp = Date.now();
  return {
    name: `Test Product ${timestamp}`,
    description: 'This is a test product created for debugging purposes. It contains the minimum required fields to pass validation.',
    variants: [{
      sku: `TEST-${timestamp}`,
      price: 99.99,
      stock: 10,
      attributes: [],
      status: 'active'
    }],
    images: [],
    tags: ['test', 'debug'],
    categories: [],
    currency: 'INR',
    isApproved: false,
    lifecycleStatus: 'active',
    moderationStatus: 'pending'
  };
};

/**
 * Analyze form validation errors
 * @param {Array} errors - Array of validation errors
 */
export const analyzeValidationErrors = (errors) => {
  if (!Array.isArray(errors) || errors.length === 0) {
    debugLog('ValidationAnalysis', '✅ No validation errors found');
    return;
  }
  
  debugLog('ValidationAnalysis', `❌ Found ${errors.length} validation errors`);
  
  const errorsByField = {};
  const errorsByType = {
    required: [],
    format: [],
    length: [],
    range: [],
    other: []
  };
  
  errors.forEach(error => {
    // Group by field
    if (!errorsByField[error.field]) {
      errorsByField[error.field] = [];
    }
    errorsByField[error.field].push(error.message);
    
    // Group by type
    const message = error.message.toLowerCase();
    if (message.includes('required')) {
      errorsByType.required.push(error);
    } else if (message.includes('format') || message.includes('invalid')) {
      errorsByType.format.push(error);
    } else if (message.includes('length') || message.includes('characters')) {
      errorsByType.length.push(error);
    } else if (message.includes('greater') || message.includes('less') || message.includes('range')) {
      errorsByType.range.push(error);
    } else {
      errorsByType.other.push(error);
    }
  });
  
  console.group('📊 Errors by Field');
  Object.entries(errorsByField).forEach(([field, messages]) => {
    console.log(`${field}:`, messages);
  });
  console.groupEnd();
  
  console.group('📊 Errors by Type');
  Object.entries(errorsByType).forEach(([type, errs]) => {
    if (errs.length > 0) {
      console.log(`${type.toUpperCase()}:`, errs.length, 'errors');
    }
  });
  console.groupEnd();
};

export default {
  debugLog,
  validateProductStructure,
  compareProductData,
  logApiRequest,
  logApiResponse,
  generateTestProduct,
  analyzeValidationErrors
};