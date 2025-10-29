/*
  File: metainflu/backend/routes/authRoutes.js
  Purpose: Defines authentication routes, including a new dedicated route for admin login.
*/

const express = require('express');
const router = express.Router();
const { registerUser, loginUser, loginAdmin, loginVendor } = require('../controllers/authController');
const { registerValidationRules, loginValidationRules } = require('../middleware/validators/authValidator');

// Define the routes for user authentication
router.post('/register', registerValidationRules(), registerUser);
router.post('/login', loginValidationRules(), loginUser);

// Define the new route for admin login
router.post('/admin/login', loginValidationRules(), loginAdmin);

// Define the new route for vendor login
router.post('/vendor/login', loginValidationRules(), loginVendor);

module.exports = router;
