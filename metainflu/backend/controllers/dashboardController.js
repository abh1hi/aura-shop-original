
const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const User = require('../models/User');

const Product = require('../models/Product'); // Import Product model

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  // 1. Total Revenue
  const totalRevenueResult = await Order.aggregate([
    { $match: { isPaid: true } },
    { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } },
  ]);
  const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].totalRevenue : 0;

  // 2. Total Orders
  const totalOrders = await Order.countDocuments({});

  // 3. Total Customers
  const totalCustomers = await User.countDocuments({ role: 'user' });

  // 4. Recent Orders
  const recentOrders = await Order.find({}).sort({ createdAt: -1 }).limit(5).populate('user', 'name');

  // 5. Top-Selling Products
  const topSellingProducts = await Order.aggregate([
    { $unwind: '$orderItems' },
    {
      $group: {
        _id: '$orderItems.product',
        totalQuantitySold: { $sum: '$orderItems.quantity' },
      },
    },
    { $sort: { totalQuantitySold: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: Product.collection.name,
        localField: '_id',
        foreignField: '_id',
        as: 'productDetails',
      },
    },
    { $unwind: '$productDetails' }, // Deconstruct the array to a single object
    {
      $project: {
        _id: 1,
        name: '$productDetails.name',
        totalQuantitySold: 1,
      },
    },
  ]);

  res.json({
    totalRevenue,
    totalOrders,
    totalCustomers,
    recentOrders,
    topSellingProducts, // Add to response
  });
});

module.exports = { getDashboardStats };
