const { KitModel } = require('../../models/kitModel');
const ExpressError = require('../../utils/expressError');
const handleRequest = require('../../utils/requestHandler');
const { invalidateKitCache, getPageDataFromDb } = require('../../services/dbService');

const createKit = handleRequest(async (req) => {
  const kit = new KitModel(req.body);
  await kit.save();
  return kit;
});

const getAllKits = handleRequest(async (req) => {
  let query = KitModel.find();
  if (req.query.name) {
    query = query.where('name', new RegExp(req.query.name, 'i'));
  }
  if (req.query.someOtherField) {
    query = query.where('someOtherField', req.query.someOtherField);
  }
  if (req.query.sortBy) {
    const order = req.query.order || 'asc';
    query = query.sort({ [req.query.sortBy]: order === 'asc' ? 1 : -1 });
  }
  query.collation({ locale: 'en', strength: 2 });
  const kits = await query.exec();

  return kits;
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
  const kit = await KitModel.findByIdAndUpdate(kitId, req.body, {
    new: true,
  });
  // Invalidate the cache for the kit using its name
  invalidateKitCache(existingKit.name);
  // Update the cache with the new data
  await getPageDataFromDb(existingKit.name, (forceUpdate = true));
  return kit;
});

const deleteKitById = handleRequest(async (req) => {
  const { kitId } = req.params;
  const existingKit = await KitModel.findById(kitId);
  if (!existingKit) {
    throw new ExpressError('Kit not found', 404);
  }
  await KitModel.findByIdAndDelete(kitId);
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

// const updateKitById = handleRequest(async (req) => {
//   const { kitId } = req.params.kitId;
//   console.log('kitId in updateKitById : ', kitId);
//   // Find the kit to verify its existence before proceeding with the update
//   const existingKit = await KitModel.findById(kitId);
//   if (!existingKit) {
//     throw new ExpressError('Kit not found', 404);
//   }
//   // Proceed with updating the kit in the database using the kitId and the request body
//   const kit = await KitModel.findByIdAndUpdate(kitId, req.body, {
//     new: true,
//   });
//   // Invalidate the cache for the kit using its kitId
//   invalidateKitCache(kitId);
//   // Update the cache with the new data, forcing an update to fetch the latest data from the database
//   await getPageDataFromDb(kitId, true);
//   return kit;
// });
