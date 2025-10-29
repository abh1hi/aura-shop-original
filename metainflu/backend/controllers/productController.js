const Product = require('../models/Product');
const Category = require('../models/Category');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const slugify = require('slugify');

// @desc    Fetch all products, optionally filtered by category
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const categoryId = req.query.category;

  const filter = {};

  if (categoryId && categoryId !== 'All') {
    if (mongoose.Types.ObjectId.isValid(categoryId)) {
      filter.categories = categoryId;
    } else {
      res.status(400);
      throw new Error('Invalid category ID format.');
    }
  }

  const products = await Product.find(filter).populate('categories', 'name').populate('variants');
  res.json(products);
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('categories', 'name');

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get all products for admin with pagination
// @route   GET /api/admin/products
// @access  Private/Admin
const getProductsAdmin = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const count = await Product.countDocuments({});
  const products = await Product.find({})
    .populate('categories', 'name')
    .populate('user', 'name')
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Vendor
const createProduct = asyncHandler(async (req, res) => {
  const { name, description, brand, modelNumber, gtin, categories, searchKeywords, popularityScore, translations, currency, regionPricing, priceHistory, discount, shippingDetails, offers, reviews, questions, wishlistCount, views, purchases, lastViewedAt, isApproved, isFeatured, isArchived, adminNotes, relatedProducts, similarProducts, version, previousVersions, bundles, lifecycleStatus, releaseDate, discontinuedDate, taxDetails, currencyPrices, restrictedRegions, embeddingVector, recommendationTags, targetAudience, clicks, addToCartCount, conversionRate, inventoryByLocation, supplier, procurementCost, leadTimeDays, moderationStatus, reviewedBy, externalIds, webhooks, metrics, autoTags, manualTags, reviewInsights, aiCategoryPrediction, moderationFlags, changeLog, attributes, arrayAttributes, variants, images, weight, dimensions, pattern, style, ageGroup, gender, releaseYear, season, careInstructions, warranty, sustainability, certifications, power, technicalSpecs, ingredients, expirationDate, safetyWarnings, inTheBox, bundleContents, regionOfOrigin, tags, ratings } = req.body;

  const product = new Product({
    name,
    slug: slugify(name, { lower: true }),
    description,
    brand,
    modelNumber,
    gtin,
    categories,
    searchKeywords,
    popularityScore,
    translations,
    currency,
    regionPricing,
    priceHistory,
    discount,
    shippingDetails,
    offers,
    reviews,
    questions,
    wishlistCount,
    views,
    purchases,
    lastViewedAt,
    isApproved,
    isFeatured,
    isArchived,
    adminNotes,
    relatedProducts,
    similarProducts,
    version,
    previousVersions,
    bundles,
    lifecycleStatus,
    releaseDate,
    discontinuedDate,
    taxDetails,
    currencyPrices,
    restrictedRegions,
    embeddingVector,
    recommendationTags,
    targetAudience,
    clicks,
    addToCartCount,
    conversionRate,
    inventoryByLocation,
    supplier,
    procurementCost,
    leadTimeDays,
    moderationStatus,
    reviewedBy,
    externalIds,
    webhooks,
    metrics,
    autoTags,
    manualTags,
    reviewInsights,
    aiCategoryPrediction,
    moderationFlags,
    changeLog,
    attributes,
    arrayAttributes,
    variants,
    images,
    weight,
    dimensions,
    pattern,
    style,
    ageGroup,
    gender,
    releaseYear,
    season,
    careInstructions,
    warranty,
    sustainability,
    certifications,
    power,
    technicalSpecs,
    ingredients,
    expirationDate,
    safetyWarnings,
    inTheBox,
    bundleContents,
    regionOfOrigin,
    user: req.user._id,
    tags,
    ratings,
  });

  const createdProduct = await product.save();
  const populatedProduct = await Product.findById(createdProduct._id).populate('categories', 'name');

  res.status(201).json(populatedProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin (or Vendor - must own product)
const updateProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const updateData = req.body;

  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (product.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this product');
  }

  const allowedUpdates = [
    'name', 'slug', 'description', 'brand', 'modelNumber', 'gtin', 'categories', 'searchKeywords', 'popularityScore', 'translations', 'currency', 'regionPricing', 'priceHistory', 'discount', 'shippingDetails', 'offers', 'reviews', 'questions', 'wishlistCount', 'views', 'purchases', 'lastViewedAt', 'isApproved', 'isFeatured', 'isArchived', 'adminNotes', 'relatedProducts', 'similarProducts', 'version', 'previousVersions', 'bundles', 'lifecycleStatus', 'releaseDate', 'discontinuedDate', 'taxDetails', 'currencyPrices', 'restrictedRegions', 'embeddingVector', 'recommendationTags', 'targetAudience', 'clicks', 'addToCartCount', 'conversionRate', 'inventoryByLocation', 'supplier', 'procurementCost', 'leadTimeDays', 'moderationStatus', 'reviewedBy', 'externalIds', 'webhooks', 'metrics', 'autoTags', 'manualTags', 'reviewInsights', 'aiCategoryPrediction', 'moderationFlags', 'changeLog', 'attributes', 'arrayAttributes', 'variants', 'images', 'weight', 'dimensions', 'pattern', 'style', 'ageGroup', 'gender', 'releaseYear', 'season', 'careInstructions', 'warranty', 'sustainability', 'certifications', 'power', 'technicalSpecs', 'ingredients', 'expirationDate', 'safetyWarnings', 'inTheBox', 'bundleContents', 'regionOfOrigin', 'tags', 'ratings'
  ];

  Object.keys(updateData).forEach(key => {
    if (allowedUpdates.includes(key)) {
      product[key] = updateData[key];
    }
  });

  if (updateData.name) {
    product.slug = slugify(updateData.name, { lower: true });
  }

  const updatedProduct = await product.save();
  const populatedProduct = await Product.findById(updatedProduct._id).populate('categories', 'name');

  res.json(populatedProduct);
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin (or Vendor - must own product)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    if (product.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to delete this product');
    }
    
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

module.exports = {
  getProducts,
  getProductById,
  getProductsAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
};