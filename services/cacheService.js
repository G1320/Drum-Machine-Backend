const { KitModel } = require('../models/kitModel');
const { Types } = require('mongoose');
const cache = new Map();

const getFromDbAndCache = async (identifier, forceUpdate = false) => {
  if (!forceUpdate) {
    // Check if the data is in the cache
    const cachedData = cache.get(identifier);
    if (cachedData) return cachedData;
  }
  // If not in cache or forceUpdate is true, query the database
  try {
    let data;
    // Check if the identifier is a MongoDB ObjectId format
    if (Types.ObjectId.isValid(identifier)) {
      data = await KitModel.findById(identifier);
    }
    // Store the result in the cache, with an expiration time
    cache.set(identifier, data);
    setTimeout(() => invalidateCache(identifier), 1000 * 60 * 5);
    return data;
  } catch (error) {
    console.error('Error fetching data from database:', error);
    return null;
  }
};

const invalidateCache = (identifier) => cache.delete(identifier);

module.exports = {
  getFromDbAndCache,
  invalidateCache,
};
