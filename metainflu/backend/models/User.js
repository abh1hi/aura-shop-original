/*
  File: metainflu/backend/models/User.js
  Purpose: This file defines the Mongoose schema for the User model.
  It includes fields for name, email, password, a new 'role' field
  to distinguish between regular users and administrators, and shipping addresses.
*/
const mongoose = require('mongoose');

const addressSchema = mongoose.Schema({
  addressType: {
    type: String,
    enum: ['Home', 'Work', 'Other'],
    default: 'Home',
  },
  fullName: { type: String, required: true },
  streetAddress: { type: String, required: true },
  apartment: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  isDefault: {
    type: Boolean,
    default: false,
  },
  latitude: {
    type: Number,
    min: -90,
    max: 90,
  },
  longitude: {
    type: Number,
    min: -180,
    max: 180,
  },
});

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
    role: {
      type: String,
      required: true,
      default: 'user',
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
    },
    shippingAddresses: [addressSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);

