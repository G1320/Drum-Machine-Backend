const { KitModel } = require('../../models/kitModel');
const ExpressError = require('../../utils/expressError');
const handleRequest = require('../../utils/requestHandler');

const createKit = handleRequest(async (req) => {
  const kit = new KitModel(req.body);
  await kit.save();
  return kit;
});

const getAllCategories = handleRequest(async () => {
  return await KitModel.find();
});

const getKitByName = handleRequest(async (req) => {
  const { kitName } = req.params;
  const kit = await KitModel.findOne({ name: kitName });
  if (!kit) {
    throw new ExpressError('Kit not found', 404);
  }
  return kit;
});

const updateKitByName = handleRequest(async (req) => {
  const { kitName } = req.params;
  const kit = await KitModel.findOneAndUpdate({ name: kitName }, req.body, {
    new: true,
  });
  if (!kit) {
    throw new ExpressError('Kit not found', 404);
  }
  return kit;
});

const deleteKitByName = handleRequest(async (req) => {
  const { kitName } = req.params;
  const kit = await KitModel.findOneAndDelete({ name: kitName });
  if (!kit) {
    throw new ExpressError('Kit not found', 404);
  }
  return null;
});

module.exports = {
  createKit,
  getAllCategories,
  getKitByName,
  updateKitByName,
  deleteKitByName,
};
