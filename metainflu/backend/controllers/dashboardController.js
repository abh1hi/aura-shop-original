const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Cart = require('../models/Cart');

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  try {
    // Get current date for time-based calculations
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Run all queries in parallel for better performance
    const [
      // Revenue Statistics
      totalRevenueResult,
      monthlyRevenueResult,
      weeklyRevenueResult,
      dailyRevenueResult,
      
      // Order Statistics
      totalOrders,
      monthlyOrders,
      weeklyOrders,
      dailyOrders,
      pendingOrders,
      completedOrders,
      
      // User Statistics
      totalUsers,
      totalCustomers,
      totalAdmins,
      totalVendors,
      newUsersThisMonth,
      activeUsersLast30Days,
      
      // Product Statistics
      totalProducts,
      approvedProducts,
      pendingProducts,
      outOfStockProducts,
      lowStockProducts,
      
      // Category Statistics
      totalCategories,
      totalParentCategories,
      totalSubCategories,
      pendingCategories,
      
      // Cart Statistics
      activeCarts,
      abandonedCarts,
      
      // Recent Data
      recentOrders,
      recentUsers,
      topSellingProducts,
      revenueChartData,
      orderStatusDistribution,
      userGrowthData
    ] = await Promise.all([
      // Revenue queries
      Order.aggregate([{ $match: { isPaid: true } }, { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }]),
      Order.aggregate([{ $match: { isPaid: true, createdAt: { $gte: startOfMonth } } }, { $group: { _id: null, monthlyRevenue: { $sum: '$totalPrice' } } }]),
      Order.aggregate([{ $match: { isPaid: true, createdAt: { $gte: startOfWeek } } }, { $group: { _id: null, weeklyRevenue: { $sum: '$totalPrice' } } }]),
      Order.aggregate([{ $match: { isPaid: true, createdAt: { $gte: startOfDay } } }, { $group: { _id: null, dailyRevenue: { $sum: '$totalPrice' } } }]),
      
      // Order queries
      Order.countDocuments({}),
      Order.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Order.countDocuments({ createdAt: { $gte: startOfWeek } }),
      Order.countDocuments({ createdAt: { $gte: startOfDay } }),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: { $in: ['delivered', 'completed'] } }),
      
      // User queries
      User.countDocuments({}),
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'admin' }),
      User.countDocuments({ role: 'vendor' }),
      User.countDocuments({ role: 'user', createdAt: { $gte: startOfMonth } }),
      User.countDocuments({ lastLoginAt: { $gte: thirtyDaysAgo } }),
      
      // Product queries
      Product.countDocuments({}),
      Product.countDocuments({ isApproved: true }),
      Product.countDocuments({ isApproved: false }),
      Product.countDocuments({ 'variants.inventory': 0 }),
      Product.countDocuments({ 'variants.inventory': { $lte: 10, $gt: 0 } }),
      
      // Category queries
      Category.countDocuments({}),
      Category.countDocuments({ parentCategory: null }),
      Category.countDocuments({ parentCategory: { $ne: null } }),
      Category.countDocuments({ status: 'pending' }),
      
      // Cart queries
      Cart.countDocuments({ items: { $exists: true, $not: { $size: 0 } } }),
      Cart.countDocuments({ updatedAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) }, items: { $exists: true, $not: { $size: 0 } } }),
      
      // Recent data queries
      Order.find({}).sort({ createdAt: -1 }).limit(10).populate('user', 'name email').lean(),
      User.find({ role: 'user' }).sort({ createdAt: -1 }).limit(10).select('name email createdAt').lean(),
      
      // Top selling products
      Order.aggregate([
        { $unwind: '$orderItems' },
        { $group: { _id: '$orderItems.product', totalQuantitySold: { $sum: '$orderItems.quantity' }, totalRevenue: { $sum: { $multiply: ['$orderItems.quantity', '$orderItems.price'] } } } },
        { $sort: { totalQuantitySold: -1 } },
        { $limit: 10 },
        { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'productDetails' } },
        { $unwind: '$productDetails' },
        { $project: { _id: 1, name: '$productDetails.name', totalQuantitySold: 1, totalRevenue: 1, image: '$productDetails.images.0' } }
      ]),
      
      // Revenue chart data (last 30 days)
      Order.aggregate([
        { $match: { isPaid: true, createdAt: { $gte: thirtyDaysAgo } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, revenue: { $sum: '$totalPrice' }, orders: { $sum: 1 } } },
        { $sort: { '_id': 1 } }
      ]),
      
      // Order status distribution
      Order.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      
      // User growth data (last 12 months)
      User.aggregate([
        { $match: { role: 'user', createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, newUsers: { $sum: 1 } } },
        { $sort: { '_id': 1 } }
      ])
    ]);

    // Process results
    const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].totalRevenue : 0;
    const monthlyRevenue = monthlyRevenueResult.length > 0 ? monthlyRevenueResult[0].monthlyRevenue : 0;
    const weeklyRevenue = weeklyRevenueResult.length > 0 ? weeklyRevenueResult[0].weeklyRevenue : 0;
    const dailyRevenue = dailyRevenueResult.length > 0 ? dailyRevenueResult[0].dailyRevenue : 0;

    // Calculate growth percentages (mock calculation - in real app, compare with previous periods)
    const revenueGrowth = monthlyRevenue > 0 ? Math.round(Math.random() * 20 - 10) : 0; // Mock growth
    const orderGrowth = monthlyOrders > 0 ? Math.round(Math.random() * 15 - 7) : 0;
    const customerGrowth = newUsersThisMonth > 0 ? Math.round((newUsersThisMonth / totalCustomers) * 100) : 0;

    res.json({
      // Summary Statistics
      summary: {
        totalRevenue,
        monthlyRevenue,
        weeklyRevenue,
        dailyRevenue,
        revenueGrowth,
        
        totalOrders,
        monthlyOrders,
        weeklyOrders,
        dailyOrders,
        pendingOrders,
        completedOrders,
        orderGrowth,
        
        totalUsers,
        totalCustomers,
        totalAdmins,
        totalVendors,
        newUsersThisMonth,
        activeUsersLast30Days,
        customerGrowth,
        
        totalProducts,
        approvedProducts,
        pendingProducts,
        outOfStockProducts,
        lowStockProducts,
        
        totalCategories,
        totalParentCategories,
        totalSubCategories,
        pendingCategories,
        
        activeCarts,
        abandonedCarts,
        
        conversionRate: activeCarts > 0 ? ((completedOrders / activeCarts) * 100).toFixed(2) : 0,
        averageOrderValue: totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0
      },
      
      // Recent Data
      recentOrders,
      recentUsers,
      topSellingProducts,
      
      // Chart Data
      charts: {
        revenueChart: revenueChartData,
        orderStatusDistribution,
        userGrowthData
      },
      
      // System Info
      systemInfo: {
        lastUpdated: new Date(),
        databaseStatus: 'connected',
        version: '1.0.0'
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Error fetching dashboard statistics', error: error.message });
  }
});

// @desc    Get platform overview
// @route   GET /api/admin/platform-overview
// @access  Private/Admin
const getPlatformOverview = asyncHandler(async (req, res) => {
  try {
    const [serverStatus, databaseStats] = await Promise.all([
      // Server status check
      Promise.resolve({
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.version,
        platform: process.platform
      }),
      
      // Database collection stats
      Promise.all([
        User.estimatedDocumentCount(),
        Product.estimatedDocumentCount(),
        Order.estimatedDocumentCount(),
        Category.estimatedDocumentCount(),
        Cart.estimatedDocumentCount()
      ])
    ]);

    res.json({
      server: serverStatus,
      database: {
        collections: {
          users: databaseStats[0],
          products: databaseStats[1],
          orders: databaseStats[2],
          categories: databaseStats[3],
          carts: databaseStats[4]
        },
        status: 'connected',
        lastChecked: new Date()
      }
    });
  } catch (error) {
    console.error('Platform overview error:', error);
    res.status(500).json({ message: 'Error fetching platform overview', error: error.message });
  }
});

module.exports = { 
  getDashboardStats,
  getPlatformOverview
};