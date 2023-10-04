const { KitModel } = require('../../models/kitModel');
const ExpressError = require('../../utils/expressError');
const handleRequest = require('../../utils/requestHandler');
const { invalidateKitCache, getAndCachePageDataFromDb } = require('../../services/dbService');

const createKit = handleRequest(async (req) => {
  const kit = new KitModel(req.body);
  await kit.save();
  return kit;
});

const getUserKits = handleRequest(async (req) => {
  const kits = await KitModel.find({ userId: req.loggedinUser._id });
  if (!kits) {
    throw new ExpressError('No kits found for this user', 404);
  }
  return kits;
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

const getKitsByIds = handleRequest(async (req) => {
  const { kitIds } = req.params;
  const ids = kitIds.split(',');
  const kits = await KitModel.find({ _id: { $in: ids } });
  if (!kits) {
    throw new ExpressError('No kits found for these ids', 404);
  }
  return kits;
});

const updateKitById = handleRequest(async (req) => {
  const { kitId } = req.params;
  // Finding the kit for cache invalidation
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
  await getAndCachePageDataFromDb(existingKit.name, (forceUpdate = true));
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
  getUserKits,
  getKitsByIds,
  getKitById,
  updateKitById,
  deleteKitById,
};

// const getKitById = handleRequest(async (req) => {
//   const { kitId } = req.params;
//   const kit = await KitModel.findById(kitId);
//   if (!kit) {
//     throw new ExpressError('Kit not found', 404);
//   }
//   return kit;
// });

// const updateKitById = handleRequest(async (req) => {
//   const { kitId } = req.params;
//   // Finding the kit for cache invalidation
//   const existingKit = await KitModel.findById(kitId);
//   if (!existingKit) {
//     throw new ExpressError('Kit not found', 404);
//   }
//   const kit = await KitModel.findByIdAndUpdate(kitId, req.body, {
//     new: true,
//   });
//   // Invalidate the cache for the kit using its name
//   invalidateKitCache(existingKit.name);
//   // Update the cache with the new data
//   await getAndCachePageDataFromDb(existingKit.name, (forceUpdate = true));
//   return kit;
// });

// const deleteKitById = handleRequest(async (req) => {
//   const { kitId } = req.params;
//   const existingKit = await KitModel.findById(kitId);
//   if (!existingKit) {
//     throw new ExpressError('Kit not found', 404);
//   }
//   await KitModel.findByIdAndDelete(kitId);
//   invalidateKitCache(existingKit.name);
//   return null;
// });

// module.exports = {
//   createKit,
//   getAllKits,
//   getUserKits,
//   getKitById,
//   updateKitById,
//   deleteKitById,
// };
