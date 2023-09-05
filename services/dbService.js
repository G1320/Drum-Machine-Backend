const { KitModel } = require('../models/kitModel');
const cache = new Map(); // A simple in-memory cache

// Main function to get page data from the database
const getPageDataFromDb = async (pageName) => {
  // First check if the data is in the cache
  const cachedData = cache.get(pageName);
  if (cachedData) return cachedData;
  // If not in cache, query the database
  try {
    const query = KitModel.findOne({ name: new RegExp(`^${pageName}$`, 'i') });
    const data = await query;
    // Store the result in the cache, with an expiration time
    cache.set(pageName, data);
    setTimeout(() => cache.delete(pageName), 1000 * 60 * 5);
    return data;
  } catch (error) {
    console.error('Error fetching data from database:', error);
    return null;
  }
};

module.exports = {
  getPageDataFromDb,
};
