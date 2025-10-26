const mongoose = require('mongoose');

const parentCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  description: String,
  image: String,
  status: {
    type: String,
    enum: ['pending', 'approved'],
    default: 'approved',
  },
});

module.exports = mongoose.model('ParentCategory', parentCategorySchema);