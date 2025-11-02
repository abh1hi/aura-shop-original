/*
  File: metainflu/backend/routes/vendorBrandRoutes.js
  Purpose: CRUD for vendor-owned brands under /api/vendor/brands
*/
const express = require('express');
const router = express.Router({ mergeParams: true });
const asyncHandler = require('express-async-handler');
const Brand = require('../models/Brand');
const { protect, vendor } = require('../middleware/authMiddleware');

// secure all with protect+vendor
router.use(protect, vendor);

router.get('/', asyncHandler(async (req, res) => {
  const brands = await Brand.find({ user: req.user._id }).sort({ createdAt: -1 });
  console.log('Brands fetched for vendor:', JSON.stringify(brands, null, 2));
  res.json(brands);
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const brand = await Brand.findOne({ _id: req.params.id, user: req.user._id });
  if (!brand) return res.status(404).json({ message: 'Brand not found' });
  res.json(brand);
}));

router.post('/', asyncHandler(async (req, res) => {
  const { name, description, logoUrl } = req.body;
  if (!name || !name.trim()) return res.status(422).json({ message: 'Brand name is required' });

  const storeSlug = name.trim().toLowerCase().replace(/\s+/g, '-');

  const created = await Brand.create({ 
    storeName: name.trim(), 
    storeSlug: storeSlug,
    aboutUs: description?.trim() || '', 
    logoUrl: logoUrl?.trim() || '', 
    user: req.user._id 
  });
  res.status(201).json(created);
}));

router.put('/:id', asyncHandler(async (req, res) => {
  const brand = await Brand.findOne({ _id: req.params.id, user: req.user._id });
  if (!brand) return res.status(404).json({ message: 'Brand not found' });
  const { name, description, logoUrl } = req.body;
  if (name !== undefined) {
    brand.storeName = name.trim();
    brand.storeSlug = name.trim().toLowerCase().replace(/\s+/g, '-');
  }
  if (description !== undefined) brand.aboutUs = description.trim();
  if (logoUrl !== undefined) brand.logoUrl = logoUrl.trim();
  const updated = await brand.save();
  res.json(updated);
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  const brand = await Brand.findOne({ _id: req.params.id, user: req.user._id });
  if (!brand) return res.status(404).json({ message: 'Brand not found' });
  await brand.deleteOne();
  res.json({ message: 'Brand deleted' });
}));

module.exports = router;
