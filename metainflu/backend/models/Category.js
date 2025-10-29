const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  description: String,
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ParentCategory',
  },
  path: [String],
  filters: [{
    name: String,
    type: String,
    options: [String],
  }],
  image: String,
  status: {
    type: String,
    enum: ['pending', 'approved'],
    default: 'approved',
  },
});

module.exports = mongoose.model('Category', categorySchema);