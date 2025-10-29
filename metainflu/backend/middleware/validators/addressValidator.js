const { body } = require('express-validator');

const addressValidationRules = () => {
  return [
    body('fullName').notEmpty().withMessage('Full name is required').trim().escape(),
    body('streetAddress').notEmpty().withMessage('Street address is required').trim().escape(),
    body('city').notEmpty().withMessage('City is required').trim().escape(),
    body('state').notEmpty().withMessage('State is required').trim().escape(),
    body('postalCode').isPostalCode('any').withMessage('Invalid postal code').trim(),
    body('country').notEmpty().withMessage('Country is required').trim().escape(),
    body('phoneNumber').isMobilePhone('any').withMessage('Invalid phone number').trim(),
    body('latitude').optional().isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
    body('longitude').optional().isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
  ];
};

module.exports = {
  addressValidationRules,
};
