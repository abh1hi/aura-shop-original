// Register vendor brand routes
const vendorBrandRoutes = require('./routes/vendorBrandRoutes');

module.exports = (app) => {
  // existing mounts ...
  app.use('/api/vendor/brands', vendorBrandRoutes);
};
