const ParentCategory = require('../models/ParentCategory');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');

// @desc    Get all parent categories
// @route   GET /api/parent-categories
// @access  Public
const getParentCategories = asyncHandler(async (req, res) => {
  const parentCategories = await ParentCategory.find({});
  res.json(parentCategories);
});

// @desc    Get a single parent category by ID
// @route   GET /api/parent-categories/:id
// @access  Public
const getParentCategoryById = asyncHandler(async (req, res) => {
  const parentCategory = await ParentCategory.findById(req.params.id);
  if (parentCategory) {
    res.json(parentCategory);
  } else {
    res.status(404).json({ message: 'Parent category not found' });
  }
});

// @desc    Create a parent category
// @route   POST /api/parent-categories
// @access  Admin
const createParentCategory = asyncHandler(async (req, res) => {
  const { name, description, image } = req.body;

  const slug = slugify(name, { lower: true });

  const parentCategory = new ParentCategory({
    name,
    slug,
    description,
    image,
  });

  const createdParentCategory = await parentCategory.save();
  res.status(201).json(createdParentCategory);
});

// @desc    Update a parent category
// @route   PUT /api/parent-categories/:id
// @access  Admin
const updateParentCategory = asyncHandler(async (req, res) => {
  const { name, description, image, status } = req.body;

  const parentCategory = await ParentCategory.findById(req.params.id);

  if (parentCategory) {
    parentCategory.name = name || parentCategory.name;
    parentCategory.description = description || parentCategory.description;
    parentCategory.image = image || parentCategory.image;
    parentCategory.status = status || parentCategory.status;

    if (name) {
      parentCategory.slug = slugify(name, { lower: true });
    }

    const updatedParentCategory = await parentCategory.save();
    res.json(updatedParentCategory);
  } else {
    res.status(404).json({ message: 'Parent category not found' });
  }
});

// @desc    Delete a parent category
// @route   DELETE /api/parent-categories/:id
// @access  Admin
const deleteParentCategory = asyncHandler(async (req, res) => {
  const parentCategory = await ParentCategory.findById(req.params.id);

  if (parentCategory) {
    await parentCategory.remove();
    res.json({ message: 'Parent category removed' });
  } else {
    res.status(404).json({ message: 'Parent category not found' });
  }
});

module.exports = { getParentCategories, getParentCategoryById, createParentCategory, updateParentCategory, deleteParentCategory };