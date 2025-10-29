const { body } = require('express-validator');

const registerValidationRules = () => {
  return [
    body('name').notEmpty().withMessage('Name is required').trim().escape(),
    body('email').isEmail().withMessage('Please include a valid email').normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  ];
};

const loginValidationRules = () => {
  return [
    body('email').isEmail().withMessage('Please include a valid email').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ];
};

module.exports = {
  registerValidationRules,
  loginValidationRules,
};
