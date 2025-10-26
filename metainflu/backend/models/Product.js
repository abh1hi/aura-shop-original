const mongoose = require('mongoose');

const attributeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: String, required: true },
  hexCode: { type: String },
  regionCode: { type: String },
  unit: { type: String },
});

const arrayAttributeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  values: [String],
});

const variantSchema = new mongoose.Schema({
  sku: { type: String, required: true },
  attributes: [attributeSchema],
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  images: [{ type: String }],
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  regionAvailability: [{
    regionCode: { type: String },
    available: { type: Boolean, default: true },
  }],
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true },
  description: { type: String, maxlength: 5000 },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
  },
  modelNumber: { type: String },
  gtin: { type: String },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  }],
  searchKeywords: [String],
  popularityScore: { type: Number, default: 0 },
  translations: {
    name: { type: Map, of: String },
    description: { type: Map, of: String },
  },
  currency: { type: String, default: "INR" },
  regionPricing: [{
    regionCode: String,
    price: Number
  }],
  priceHistory: [{ date: Date, price: Number }],
  discount: {
    type: { type: String, enum: ['percentage', 'flat'] },
    value: Number,
    startDate: Date,
    endDate: Date,
  },
  shippingDetails: {
    isFreeShipping: { type: Boolean, default: false },
    fulfillmentType: { type: String, enum: ['FBA', 'Seller', 'ThirdParty'] },
    returnPolicyDays: { type: Number, default: 7 },
    fragile: { type: Boolean, default: false },
  },
  offers: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    price: Number,
    stock: Number,
    rating: Number,
    shippingTime: String,
  }],
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: Number,
    comment: String,
    createdAt: { type: Date, default: Date.now },
  }],
  questions: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    question: String,
    answers: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      answer: String
    }]
  }],
  wishlistCount: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  purchases: { type: Number, default: 0 },
  lastViewedAt: Date,
  isApproved: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  isArchived: { type: Boolean, default: false },
  adminNotes: String,
  relatedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  similarProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  version: { type: Number, default: 1 },
  previousVersions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  bundles: [{
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    discount: Number,
    bundleName: String
  }],
  lifecycleStatus: {
    type: String,
    enum: ['active', 'coming_soon', 'discontinued', 'out_of_stock'],
    default: 'active'
  },
  releaseDate: Date,
  discontinuedDate: Date,
  taxDetails: {
    taxCode: String,
    gstRate: Number,
    hsnCode: String,
    vatApplicable: Boolean
  },
  currencyPrices: {
    USD: Number,
    EUR: Number,
    INR: Number,
    GBP: Number
  },
  restrictedRegions: [String],
  embeddingVector: [Number],
  recommendationTags: [String],
  targetAudience: {
    gender: [String],
    ageRange: { min: Number, max: Number },
    lifestyleTags: [String],
  },
  clicks: { type: Number, default: 0 },
  addToCartCount: { type: Number, default: 0 },
  conversionRate: { type: Number, default: 0 },
  inventoryByLocation: [{
    warehouseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' },
    stock: Number,
    reserved: Number,
    lastRestocked: Date,
  }],
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
  procurementCost: Number,
  leadTimeDays: Number,
  moderationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  externalIds: {
    amazonASIN: String,
    flipkartSKU: String,
    shopifyProductId: String,
    customIntegrationIds: Map
  },
  webhooks: [{
    event: String,
    endpoint: String
  }],
  metrics: {
    dailySales: { type: Number, default: 0 },
    weeklySales: { type: Number, default: 0 },
    returnRate: { type: Number, default: 0 },
    averageProfitMargin: { type: Number, default: 0 },
  },
  autoTags: [String],
  manualTags: [String],
  reviewInsights: {
    averageSentiment: Number,
    commonKeywords: [String],
  },
  aiCategoryPrediction: {
    predictedCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    confidenceScore: Number
  },
  moderationFlags: {
    containsProhibitedTerms: Boolean,
    flaggedByUsers: Number,
    autoHidden: Boolean,
  },
  changeLog: [{
    field: String,
    oldValue: mongoose.Schema.Types.Mixed,
    newValue: mongoose.Schema.Types.Mixed,
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    changedAt: Date,
  }],
  attributes: [attributeSchema],
  arrayAttributes: [arrayAttributeSchema],
  variants: [variantSchema],
  images: [{
    url: { type: String },
    altText: { type: String },
    position: { type: Number },
    variantSku: { type: String, default: null },
    isPrimary: { type: Boolean, default: false },
  }],
  weight: { type: Number },
  dimensions: {
    length: { type: Number },
    width: { type: Number },
    height: { type: Number },
    unit: { type: String },
  },
  pattern: { type: String },
  style: { type: String },
  ageGroup: { type: String },
  gender: { type: String },
  releaseYear: { type: String },
  season: { type: String },
  careInstructions: { type: String },
  warranty: { type: String },
  sustainability: [String],
  certifications: [String],
  power: {
    voltage: { type: Number },
    unit: { type: String, default: "V" },
  },
  technicalSpecs: [{
    key: { type: String },
    value: { type: String },
    group: { type: String },
  }],
  ingredients: [String],
  expirationDate: { type: Date },
  safetyWarnings: { type: String },
  inTheBox: [String],
  bundleContents: [String],
  regionOfOrigin: { type: String },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tags: [String],
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
    breakdown: {
      1: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      5: { type: Number, default: 0 },
    }
  },
}, { timestamps: true });

productSchema.index(
  { 'variants.sku': 1 },
  { unique: true, partialFilterExpression: { 'variants.sku': { $exists: true, $type: 'string', $ne: '' } } }
);

module.exports = mongoose.model('Product', productSchema);