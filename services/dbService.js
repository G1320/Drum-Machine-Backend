const { KitModel } = require('../models/kitModel');
const mongoose = require('mongoose'); // Needed to use ObjectId.isValid
const cache = new Map(); // A simple in-memory cache

const getAndCachePageDataFromDb = async (identifier, forceUpdate = false) => {
  if (!forceUpdate) {
    // First check if the data is in the cache
    const cachedData = cache.get(identifier);
    if (cachedData) return cachedData;
  }
  // If not in cache or forceUpdate is true, query the database
  try {
    let data;
    // Check if the identifier is a MongoDB ObjectId format
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      data = await KitModel.findById(identifier);
    }
    // Store the result in the cache, with an expiration time
    cache.set(identifier, data);
    setTimeout(() => cache.delete(identifier), 1000 * 60 * 5);
    return data;
  } catch (error) {
    console.error('Error fetching data from database:', error);
    return null;
  }
};

const invalidateKitCache = (identifier) => {
  cache.delete(identifier);
};

const updateKit = async (kitId, updatedData) => {
  try {
    const updatedKit = await KitModel.findByIdAndUpdate(kitId, updatedData, { new: true });
    // Invalidate the cache entry for the kit
    invalidateKitCache(kitId); // Invalidate using kitId
    if (updatedData.name) {
      invalidateKitCache(updatedData.name); // Also invalidate using kit name in case it changed
    }
    return updatedKit;
  } catch (error) {
    console.error('Error updating kit:', error);
    throw error;
  }
};

module.exports = {
  getAndCachePageDataFromDb,
  updateKit,
  invalidateKitCache,
};
