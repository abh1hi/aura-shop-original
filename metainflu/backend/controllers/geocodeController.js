const fetch = require('node-fetch');

// @desc    Reverse geocode coordinates to an address
// @route   POST /api/geocode/reverse
// @access  Private
exports.reverseGeocode = async (req, res) => {
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({ message: 'Latitude and longitude are required' });
  }

  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'AuraShop/1.0' // Nominatim requires a user-agent
      }
    });
    const data = await response.json();

    if (data.error) {
      return res.status(404).json({ message: data.error });
    }

    res.json(data.address);
  } catch (error) {
    res.status(500).json({ message: 'Server Error during geocoding' });
  }
};
