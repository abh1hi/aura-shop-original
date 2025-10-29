const { body } = require('express-validator');

const orderValidationRules = () => {
  return [
    body('shippingAddress').notEmpty().withMessage('Shipping address is required'),
    body('paymentMethod').notEmpty().withMessage('Payment method is required'),
  ];
};

module.exports = {
  orderValidationRules,
};
