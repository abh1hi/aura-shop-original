const Category = require('../models/Category');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');

// @desc    Fetch all categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ status: 'approved' }).populate('parentCategory');
  res.json(categories);
});

// @desc    Fetch single category
// @route   GET /api/categories/:id
// @access  Public
const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id).populate('parentCategory');

  if (category) {
    res.json(category);
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
  const { name, description, parentCategory, filters, image } = req.body;

  const slug = slugify(name, { lower: true });

  let path = [slug];
  if (parentCategory) {
    const parent = await Category.findById(parentCategory);
    if (parent) {
      path = [...parent.path, slug];
    }
  }

  const category = new Category({
    name,
    slug,
    description,
    parentCategory,
    path,
    filters,
    image,
  });

  const createdCategory = await category.save();
  res.status(201).json(createdCategory);
});

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
  const { name, description, parentCategory, filters, image, status } = req.body;

  const category = await Category.findById(req.params.id);

  if (category) {
    category.name = name || category.name;
    category.description = description || category.description;
    category.parentCategory = parentCategory || category.parentCategory;
    category.filters = filters || category.filters;
    category.image = image || category.image;
    category.status = status || category.status;

    if (name) {
      category.slug = slugify(name, { lower: true });
    }

    if (name || parentCategory) {
        let path = [category.slug];
        if (category.parentCategory) {
            const parent = await Category.findById(category.parentCategory);
            if (parent) {
                path = [...parent.path, category.slug];
            }
        }
        category.path = path;
    }

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    await category.remove();
    res.json({ message: 'Category removed' });
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};