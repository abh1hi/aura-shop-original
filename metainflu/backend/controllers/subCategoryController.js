
const SubCategory = require('../models/SubCategory');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');

// @desc    Create a sub-category
// @route   POST /api/subcategories
// @access  Private/Admin
const createSubCategory = asyncHandler(async (req, res) => {
  const { name, category, parentCategory } = req.body;
  const subCategory = new SubCategory({
    name,
    slug: slugify(name, { lower: true }),
    category,
    parentCategory,
  });
  const createdSubCategory = await subCategory.save();
  res.status(201).json(createdSubCategory);
});

// @desc    Get all sub-categories, optionally filtered by category
// @route   GET /api/subcategories
// @access  Public (or Private/Admin depending on use case, let's make it public for now)
const getSubCategories = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.category) {
    filter.category = req.query.category;
  }
  const subCategories = await SubCategory.find(filter).populate({
    path: 'category',
    populate: {
      path: 'parentCategory',
      model: 'ParentCategory'
    }
  });
  res.json(subCategories);
});

// @desc    Get sub-category by ID
// @route   GET /api/subcategories/:id
// @access  Public
const getSubCategoryById = asyncHandler(async (req, res) => {
  const subCategory = await SubCategory.findById(req.params.id);
  if (subCategory) {
    res.json(subCategory);
  } else {
    res.status(404);
    throw new Error('Sub-category not found');
  }
});

// @desc    Update a sub-category
// @route   PUT /api/subcategories/:id
// @access  Private/Admin
const updateSubCategory = asyncHandler(async (req, res) => {
  const { name, category, parentCategory } = req.body;
  const subCategory = await SubCategory.findById(req.params.id);

  if (subCategory) {
    subCategory.name = name || subCategory.name;
    subCategory.slug = name ? slugify(name, { lower: true }) : subCategory.slug;
    subCategory.category = category || subCategory.category;
    subCategory.parentCategory = parentCategory || subCategory.parentCategory;

    const updatedSubCategory = await subCategory.save();
    res.json(updatedSubCategory);
  } else {
    res.status(404);
    throw new Error('Sub-category not found');
  }
});

// @desc    Delete a sub-category
// @route   DELETE /api/subcategories/:id
// @access  Private/Admin
const deleteSubCategory = asyncHandler(async (req, res) => {
  const subCategory = await SubCategory.findById(req.params.id);
  if (subCategory) {
    await subCategory.deleteOne();
    res.json({ message: 'Sub-category removed' });
  } else {
    res.status(404);
    throw new Error('Sub-category not found');
  }
});

module.exports = {
  createSubCategory,
  getSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
};
