const { KitModel } = require('../../models/kitModel');
const ExpressError = require('../../utils/expressError');
const handleRequest = require('../../utils/requestHandler');

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
  const kit = await KitModel.findByIdAndUpdate(kitId, req.body, {
    new: true,
  });
  if (!kit) {
    throw new ExpressError('Kit not found', 404);
  }
  return kit;
});

const deleteKitById = handleRequest(async (req) => {
  const { kitId } = req.params;
  const kit = await KitModel.findByIdAndDelete(kitId);
  if (!kit) {
    throw new ExpressError('Kit not found', 404);
  }
  return null;
});

module.exports = {
  createKit,
  getAllKits,
  getKitById,
  updateKitById,
  deleteKitById,
};
