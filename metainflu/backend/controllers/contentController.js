
const asyncHandler = require('express-async-handler');
const HeroBanner = require('../models/HeroBanner');
const FeaturedCollection = require('../models/FeaturedCollection');

// --- Hero Banner Controllers ---

// @desc    Get all hero banners
// @route   GET /api/admin/content/herobanners
// @access  Private/Admin
const getHeroBanners = asyncHandler(async (req, res) => {
  const banners = await HeroBanner.find({});
  res.json(banners);
});

// @desc    Create a hero banner
// @route   POST /api/admin/content/herobanners
// @access  Private/Admin
const createHeroBanner = asyncHandler(async (req, res) => {
  const { title, subtitle, imageUrl, link } = req.body;
  const banner = new HeroBanner({ title, subtitle, imageUrl, link });
  const createdBanner = await banner.save();
  res.status(201).json(createdBanner);
});

// @desc    Update a hero banner
// @route   PUT /api/admin/content/herobanners/:id
// @access  Private/Admin
const updateHeroBanner = asyncHandler(async (req, res) => {
  const { title, subtitle, imageUrl, link } = req.body;
  const banner = await HeroBanner.findById(req.params.id);

  if (banner) {
    banner.title = title || banner.title;
    banner.subtitle = subtitle || banner.subtitle;
    banner.imageUrl = imageUrl || banner.imageUrl;
    banner.link = link || banner.link;
    const updatedBanner = await banner.save();
    res.json(updatedBanner);
  } else {
    res.status(404);
    throw new Error('Hero banner not found');
  }
});

// @desc    Delete a hero banner
// @route   DELETE /api/admin/content/herobanners/:id
// @access  Private/Admin
const deleteHeroBanner = asyncHandler(async (req, res) => {
  const banner = await HeroBanner.findById(req.params.id);
  if (banner) {
    await banner.deleteOne();
    res.json({ message: 'Hero banner removed' });
  } else {
    res.status(404);
    throw new Error('Hero banner not found');
  }
});

// --- Featured Collection Controllers ---

// @desc    Get all featured collections
// @route   GET /api/admin/content/featuredcollections
// @access  Private/Admin
const getFeaturedCollections = asyncHandler(async (req, res) => {
  const collections = await FeaturedCollection.find({}).populate('products', 'name');
  res.json(collections);
});

// @desc    Create a featured collection
// @route   POST /api/admin/content/featuredcollections
// @access  Private/Admin
const createFeaturedCollection = asyncHandler(async (req, res) => {
  const { title, description, products } = req.body;
  const collection = new FeaturedCollection({ title, description, products });
  const createdCollection = await collection.save();
  res.status(201).json(createdCollection);
});

// @desc    Update a featured collection
// @route   PUT /api/admin/content/featuredcollections/:id
// @access  Private/Admin
const updateFeaturedCollection = asyncHandler(async (req, res) => {
  const { title, description, products } = req.body;
  const collection = await FeaturedCollection.findById(req.params.id);

  if (collection) {
    collection.title = title || collection.title;
    collection.description = description || collection.description;
    collection.products = products || collection.products;
    const updatedCollection = await collection.save();
    res.json(updatedCollection);
  } else {
    res.status(404);
    throw new Error('Featured collection not found');
  }
});

// @desc    Delete a featured collection
// @route   DELETE /api/admin/content/featuredcollections/:id
// @access  Private/Admin
const deleteFeaturedCollection = asyncHandler(async (req, res) => {
  const collection = await FeaturedCollection.findById(req.params.id);
  if (collection) {
    await collection.deleteOne();
    res.json({ message: 'Featured collection removed' });
  } else {
    res.status(404);
    throw new Error('Featured collection not found');
  }
});

module.exports = {
  getHeroBanners,
  createHeroBanner,
  updateHeroBanner,
  deleteHeroBanner,
  getFeaturedCollections,
  createFeaturedCollection,
  updateFeaturedCollection,
  deleteFeaturedCollection,
};
