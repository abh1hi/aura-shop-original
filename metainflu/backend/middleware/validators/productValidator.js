const { body } = require('express-validator');

const productValidationRules = () => {
  return [
    body('name').notEmpty().withMessage('Product name is required').trim().escape(),
    body('description').notEmpty().withMessage('Description is required').trim().escape(),
    body('brand').notEmpty().withMessage('Brand is required').trim().escape(),
    body('categories').isArray().withMessage('Categories must be an array of valid Category IDs'),
    body('variants').optional().isArray().withMessage('Variants must be an array.'),
    body('variants.*.sku').optional().notEmpty().withMessage('SKU is required for variants.'),
    body('variants.*.price').optional().isFloat({ gt: 0 }).withMessage('Variant price must be a positive number.'),
    body('variants.*.stock').optional().isInt({ min: 0 }).withMessage('Variant stock must be a non-negative integer.'),
    body('images').optional().isArray().withMessage('Images must be an array of strings.'),
    body('tags').optional().isArray().withMessage('Tags must be an array of strings.')
  ];
};

module.exports = {
  productValidationRules,
};
