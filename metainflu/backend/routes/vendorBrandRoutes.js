/*
  File: metainflu/backend/routes/vendorBrandRoutes.js
  Purpose: CRUD for vendor-owned brands under /api/vendor/brands
*/
const express = require('express');
const router = express.Router({ mergeParams: true });
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const { protect, vendor } = require('../middleware/authMiddleware');

let Brand;
try { Brand = require('../models/Brand'); }
catch (e) {
  const brandSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    logoUrl: { type: String, default: '' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  }, { timestamps: true });
  Brand = mongoose.model('Brand', brandSchema);
}

// secure all with protect+vendor
router.use(protect, vendor);

router.get('/', asyncHandler(async (req, res) => {
  const brands = await Brand.find({ owner: req.user._id }).sort({ createdAt: -1 });
  res.json(brands);
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const brand = await Brand.findOne({ _id: req.params.id, owner: req.user._id });
  if (!brand) return res.status(404).json({ message: 'Brand not found' });
  res.json(brand);
}));

router.post('/', asyncHandler(async (req, res) => {
  const { name, description, logoUrl } = req.body;
  if (!name || !name.trim()) return res.status(422).json({ message: 'Brand name is required' });
  const created = await Brand.create({ name: name.trim(), description: description?.trim() || '', logoUrl: logoUrl?.trim() || '', owner: req.user._id });
  res.status(201).json(created);
}));

router.put('/:id', asyncHandler(async (req, res) => {
  const brand = await Brand.findOne({ _id: req.params.id, owner: req.user._id });
  if (!brand) return res.status(404).json({ message: 'Brand not found' });
  const { name, description, logoUrl } = req.body;
  if (name !== undefined) brand.name = name.trim();
  if (description !== undefined) brand.description = description.trim();
  if (logoUrl !== undefined) brand.logoUrl = logoUrl.trim();
  const updated = await brand.save();
  res.json(updated);
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  const brand = await Brand.findOne({ _id: req.params.id, owner: req.user._id });
  if (!brand) return res.status(404).json({ message: 'Brand not found' });
  await brand.deleteOne();
  res.json({ message: 'Brand deleted' });
}));

module.exports = router;
