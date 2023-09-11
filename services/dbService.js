const { KitModel } = require('../models/kitModel');
const cache = new Map(); // A simple in-memory cache

// Main function to get page data from the database
const getPageDataFromDb = async (pageName, forceUpdate = false) => {
  if (!forceUpdate) {
    // First check if the data is in the cache
    const cachedData = cache.get(pageName);
    if (cachedData) return cachedData;
  }
  // If not in cache or forceUpdate is true, query the database
  try {
    const data = await KitModel.findOne({ name: new RegExp(`^${pageName}$`, 'i') });
    // Store the result in the cache, with an expiration time
    cache.set(pageName, data);
    setTimeout(() => cache.delete(pageName), 1000 * 60 * 5);
    return data;
  } catch (error) {
    console.error('Error fetching data from database:', error);
    return null;
  }
};

// Function to invalidate a cache entry
const invalidateKitCache = (pageName) => {
  cache.delete(pageName);
};
// Method to update a kit in the database
const updateKit = async (kitId, updatedData) => {
  try {
    // Update the kit in the database
    const updatedKit = await KitModel.findByIdAndUpdate(kitId, updatedData, { new: true });
    // Invalidate the cache entry for the kit
    invalidateKitCache(updatedKit.name);
    return updatedKit;
  } catch (error) {
    console.error('Error updating kit:', error);
    throw error;
  }
};

module.exports = {
  getPageDataFromDb,
  updateKit,
  invalidateKitCache,
};
