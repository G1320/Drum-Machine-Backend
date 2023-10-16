const { KitModel } = require('../../models/kitModel');
const ExpressError = require('../../utils/expressError');
const handleRequest = require('../../utils/requestHandler');
const { invalidateKitCache, getAndCachePageDataFromDb } = require('../../services/dbService');

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

  const existingKit = await KitModel.findById(kitId);
  if (!existingKit) throw new ExpressError('Kit not found', 404);

  const updatedKit = await KitModel.findByIdAndUpdate(kitId, req.body, {
    new: true,
  });
  // Invalidate the cache for the kit using its name
  invalidateKitCache(kitId);
  // Update the cache with the new data
  await getAndCachePageDataFromDb(kitId, (forceUpdate = true));
  return updatedKit;
});

const deleteKitById = handleRequest(async (req) => {
  const { kitId } = req.params;
  const existingKit = await KitModel.findById(kitId);
  if (!existingKit) {
    throw new ExpressError('Kit not found', 404);
  }
  await KitModel.findByIdAndDelete(kitId);
  invalidateKitCache(kitId);
  return null;
});

module.exports = {
  createKit,
  getAllKits,
  getKitById,
  updateKitById,
  deleteKitById,
};
