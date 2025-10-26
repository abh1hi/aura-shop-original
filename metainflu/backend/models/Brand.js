const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  storeName: {
    type: String,
    required: true,
    unique: true,
  },
  storeSlug: {
    type: String,
    required: true,
    unique: true,
  },
  templateId: {
    type: String,
    default: 'template-1',
  },
  logoUrl: String,
  heroImageUrl: String,
  tagline: String,
  aboutUs: String,
  socialLinks: {
    instagram: String,
    facebook: String,
    twitter: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Brand', brandSchema);
