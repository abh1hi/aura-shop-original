/* Mount vendor brand CRUD under /api/vendor/brands */
const vendorBrandRoutes = require('./routes/vendorBrandRoutes');

// insert after vendor routes
app.use('/api/vendor/brands', vendorBrandRoutes);
