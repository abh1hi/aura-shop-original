const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id }).populate('products');
    if (!wishlist) {
      return res.json([]);
    }
    res.json(wishlist.products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist/add
// @access  Private
exports.addToWishlist = async (req, res) => {
  const { productId } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, products: [productId] });
    } else {
      if (wishlist.products.includes(productId)) {
        return res.status(400).json({ message: 'Product already in wishlist' });
      }
      wishlist.products.push(productId);
      await wishlist.save();
    }

    const populatedWishlist = await Wishlist.findById(wishlist._id).populate('products');
    res.status(201).json(populatedWishlist.products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/remove/:productId
// @access  Private
exports.removeFromWishlist = async (req, res) => {
  const { productId } = req.params;

  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId
    );

    await wishlist.save();
    const populatedWishlist = await Wishlist.findById(wishlist._id).populate('products');

    res.json(populatedWishlist.products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
