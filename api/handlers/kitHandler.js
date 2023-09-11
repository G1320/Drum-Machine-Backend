const { KitModel } = require('../../models/kitModel');
const ExpressError = require('../../utils/expressError');
const handleRequest = require('../../utils/requestHandler');
const { invalidateKitCache, getPageDataFromDb } = require('../../services/dbService');

const createKit = handleRequest(async (req) => {
  const kit = new KitModel(req.body);
  await kit.save();
  return kit;
});

const getAllKits = handleRequest(async () => {
  return await KitModel.find();
});

const getKitById = handleRequest(async (req) => {
  const { kitId } = req.params;
  const kit = await KitModel.findById(kitId);
  if (!kit) {
    throw new ExpressError('Kit not found', 404);
  }
  return kit;
});

const updateKitById = handleRequest(async (req) => {
  const { kitId } = req.params;
  // Find the kit to get its name for cache invalidation
  const existingKit = await KitModel.findById(kitId);
  if (!existingKit) {
    throw new ExpressError('Kit not found', 404);
  }

  // Update the kit
  const kit = await KitModel.findByIdAndUpdate(kitId, req.body, {
    new: true,
  });

  // Invalidate the cache for the kit using its name
  invalidateKitCache(existingKit.name);

  // Update the cache with the new data
  await getPageDataFromDb(existingKit.name, true);

  return kit;
});

const deleteKitById = handleRequest(async (req) => {
  const { kitId } = req.params;
  // Find the kit to get its name for cache invalidation
  const existingKit = await KitModel.findById(kitId);
  if (!existingKit) {
    throw new ExpressError('Kit not found', 404);
  }
  // Delete the kit
  await KitModel.findByIdAndDelete(kitId);
  // Invalidate the cache for the kit using its name
  invalidateKitCache(existingKit.name);
  return null;
});

module.exports = {
  createKit,
  getAllKits,
  getKitById,
  updateKitById,
  deleteKitById,
};
