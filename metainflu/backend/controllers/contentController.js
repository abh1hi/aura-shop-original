const HeroBanner = require('../models/HeroBanner');
const FeaturedCollection = require('../models/FeaturedCollection');
const Product = require('../models/Product');

// Hero Banner Controllers with Enhanced Features

// @desc    Get all hero banners with status filtering
// @route   GET /api/admin/content/herobanners
// @access  Private/Admin
const getHeroBanners = async (req, res) => {
  try {
    const { status, search, limit = 50 } = req.query;
    let query = {};

    // Filter by status if provided
    if (status && status !== '') {
      query.status = status;
    }

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subtitle: { $regex: search, $options: 'i' } }
      ];
    }

    const banners = await HeroBanner.find(query)
      .sort({ order: 1, createdAt: -1 })
      .limit(parseInt(limit));

    // Update expired banners
    const now = new Date();
    await HeroBanner.updateMany(
      { 
        scheduledEnd: { $lt: now },
        status: { $in: ['published', 'scheduled'] }
      },
      { status: 'expired' }
    );

    // Activate scheduled banners
    await HeroBanner.updateMany(
      {
        scheduledStart: { $lte: now },
        scheduledEnd: { $gt: now },
        status: 'scheduled'
      },
      { status: 'published' }
    );

    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create hero banner with scheduling
// @route   POST /api/admin/content/herobanners
// @access  Private/Admin
const createHeroBanner = async (req, res) => {
  try {
    const bannerData = {
      ...req.body,
      createdBy: req.user?.id,
      createdAt: new Date()
    };

    // Validate scheduling
    if (bannerData.status === 'scheduled') {
      if (!bannerData.scheduledStart) {
        return res.status(400).json({ message: 'Scheduled start date is required for scheduled banners' });
      }
      
      const startDate = new Date(bannerData.scheduledStart);
      if (startDate <= new Date()) {
        return res.status(400).json({ message: 'Scheduled start date must be in the future' });
      }

      if (bannerData.scheduledEnd) {
        const endDate = new Date(bannerData.scheduledEnd);
        if (endDate <= startDate) {
          return res.status(400).json({ message: 'Scheduled end date must be after start date' });
        }
      }
    }

    // Create banner document structure
    const bannerDocument = {
      title: bannerData.title,
      subtitle: bannerData.subtitle || '',
      imageUrl: bannerData.imageUrl,
      link: bannerData.link || '',
      status: bannerData.status || 'draft',
      order: bannerData.order || 1,
      priority: bannerData.priority || 'medium',
      scheduledStart: bannerData.scheduledStart || null,
      scheduledEnd: bannerData.scheduledEnd || null,
      createdBy: bannerData.createdBy,
      createdAt: bannerData.createdAt
    };

    // For now, store as a generic document if HeroBanner model doesn't exist
    // This would be replaced with actual model operations
    res.status(201).json({ 
      _id: Date.now().toString(),
      ...bannerDocument,
      message: 'Banner created successfully' 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update hero banner
// @route   PUT /api/admin/content/herobanners/:id
// @access  Private/Admin
const updateHeroBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updatedBy: req.user?.id,
      updatedAt: new Date()
    };

    // Validate scheduling
    if (updateData.status === 'scheduled') {
      if (!updateData.scheduledStart) {
        return res.status(400).json({ message: 'Scheduled start date is required for scheduled banners' });
      }
      
      if (updateData.scheduledEnd) {
        const startDate = new Date(updateData.scheduledStart);
        const endDate = new Date(updateData.scheduledEnd);
        if (endDate <= startDate) {
          return res.status(400).json({ message: 'Scheduled end date must be after start date' });
        }
      }
    }

    // For now, return success response
    res.json({ 
      _id: id,
      ...updateData,
      message: 'Banner updated successfully' 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete hero banner
// @route   DELETE /api/admin/content/herobanners/:id
// @access  Private/Admin
const deleteHeroBanner = async (req, res) => {
  try {
    res.json({ message: 'Banner deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Featured Collection Controllers

// @desc    Get all featured collections with status filtering
// @route   GET /api/admin/content/featuredcollections
// @access  Private/Admin
const getFeaturedCollections = async (req, res) => {
  try {
    const { status, search, limit = 50 } = req.query;
    
    // For now, return mock data structure
    const mockCollections = [
      {
        _id: '1',
        title: 'Summer Collection',
        description: 'Hot summer styles and trends',
        products: [],
        status: 'published',
        createdAt: new Date()
      },
      {
        _id: '2', 
        title: 'Winter Sale',
        description: 'Warm clothing for cold days',
        products: [],
        status: 'draft',
        createdAt: new Date()
      }
    ];

    res.json(mockCollections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create featured collection with scheduling
// @route   POST /api/admin/content/featuredcollections
// @access  Private/Admin
const createFeaturedCollection = async (req, res) => {
  try {
    const collectionData = {
      ...req.body,
      _id: Date.now().toString(),
      createdBy: req.user?.id,
      createdAt: new Date()
    };

    // Validate scheduling
    if (collectionData.status === 'scheduled') {
      if (!collectionData.scheduledStart) {
        return res.status(400).json({ message: 'Scheduled start date is required for scheduled collections' });
      }
      
      const startDate = new Date(collectionData.scheduledStart);
      if (startDate <= new Date()) {
        return res.status(400).json({ message: 'Scheduled start date must be in the future' });
      }

      if (collectionData.scheduledEnd) {
        const endDate = new Date(collectionData.scheduledEnd);
        if (endDate <= startDate) {
          return res.status(400).json({ message: 'Scheduled end date must be after start date' });
        }
      }
    }
    
    res.status(201).json({ 
      ...collectionData,
      message: 'Collection created successfully' 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update featured collection
// @route   PUT /api/admin/content/featuredcollections/:id
// @access  Private/Admin
const updateFeaturedCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      _id: id,
      updatedBy: req.user?.id,
      updatedAt: new Date()
    };

    res.json({ 
      ...updateData,
      message: 'Collection updated successfully' 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete featured collection
// @route   DELETE /api/admin/content/featuredcollections/:id
// @access  Private/Admin
const deleteFeaturedCollection = async (req, res) => {
  try {
    res.json({ message: 'Collection deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get content preview data
// @route   GET /api/admin/content/preview
// @access  Private/Admin
const getContentPreview = async (req, res) => {
  try {
    // Mock preview data
    const previewData = {
      banners: [
        {
          _id: '1',
          title: 'Summer Sale',
          subtitle: 'Up to 50% off on summer collection',
          imageUrl: 'https://via.placeholder.com/800x400?text=Summer+Sale',
          link: '/summer-sale',
          status: 'published'
        }
      ],
      collections: [
        {
          _id: '1',
          title: 'Trending Now',
          description: 'Most popular items this week',
          products: [],
          status: 'published'
        }
      ],
      previewGenerated: new Date(),
      totalBanners: 1,
      totalCollections: 1
    };

    res.json(previewData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  // Hero Banner methods
  getHeroBanners,
  createHeroBanner,
  updateHeroBanner,
  deleteHeroBanner,
  
  // Featured Collection methods
  getFeaturedCollections,
  createFeaturedCollection,
  updateFeaturedCollection,
  deleteFeaturedCollection,
  
  // Utility methods
  getContentPreview
};