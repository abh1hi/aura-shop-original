const Brand = require('../models/Brand');
const User = require('../models/User');
const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');

// @desc    Get brand page details by slug
// @route   GET /api/brands/:slug
// @access  Public
const getBrandBySlug = asyncHandler(async (req, res) => {
  const brand = await Brand.findOne({ storeSlug: req.params.slug }).populate('user', 'name email');

  if (brand) {
    const products = await Product.find({ brand: brand._id });
    res.json({ brand, products });
  } else {
    res.status(404);
    throw new Error('Brand not found');
  }
});

// @desc    Get the logged-in vendor's brand page details
// @route   GET /api/brands/my-brand
// @access  Private/Vendor
const getMyBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findOne({ user: req.user._id });

  if (brand) {
    res.json(brand);
  } else {
    res.status(404);
    throw new Error('Brand not found');
  }
});

// @desc    Create a new brand page
// @route   POST /api/brands
// @access  Private/Vendor
const createBrand = asyncHandler(async (req, res) => {
  const { storeName, templateId, logoUrl, heroImageUrl, tagline, aboutUs, socialLinks } = req.body;

  const storeSlug = slugify(storeName, { lower: true });

  const brandExists = await Brand.findOne({ storeSlug });

  if (brandExists) {
    res.status(400);
    throw new Error('A brand with this name already exists.');
  }

  const brand = new Brand({
    user: req.user._id,
    storeName,
    storeSlug,
    templateId,
    logoUrl,
    heroImageUrl,
    tagline,
    aboutUs,
    socialLinks,
  });

  const createdBrand = await brand.save();

  // Update user with brand id
  await User.findByIdAndUpdate(req.user._id, { brand: createdBrand._id });

  res.status(201).json(createdBrand);
});

// @desc    Update brand page details
// @route   PUT /api/brands/:id
// @access  Private/Vendor
const updateBrand = asyncHandler(async (req, res) => {
  const { storeName, templateId, logoUrl, heroImageUrl, tagline, aboutUs, socialLinks } = req.body;

  const brand = await Brand.findById(req.params.id);

  if (brand) {
    if (brand.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to update this brand');
    }

    brand.storeName = storeName || brand.storeName;
    if (storeName) {
      brand.storeSlug = slugify(storeName, { lower: true });
    }
    brand.templateId = templateId || brand.templateId;
    brand.logoUrl = logoUrl || brand.logoUrl;
    brand.heroImageUrl = heroImageUrl || brand.heroImageUrl;
    brand.tagline = tagline || brand.tagline;
    brand.aboutUs = aboutUs || brand.aboutUs;
    brand.socialLinks = socialLinks || brand.socialLinks;

    const updatedBrand = await brand.save();
    res.json(updatedBrand);

  } else {
    res.status(404);
    throw new Error('Brand not found');
  }
});

module.exports = {
  getBrandBySlug,
  getMyBrand,
  createBrand,
  updateBrand,
};
