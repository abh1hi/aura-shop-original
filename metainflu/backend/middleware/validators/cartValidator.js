const { body } = require('express-validator');

const cartValidationRules = () => {
  return [
    body('productId').isMongoId().withMessage('Invalid product ID'),
    body('quantity').isInt({ gt: 0 }).withMessage('Quantity must be a positive integer'),
  ];
};

module.exports = {
  cartValidationRules,
};
