const { KitModel } = require('../../models/kitModel');
const { SoundModel } = require('../../models/soundModel');
const { UserModel } = require('../../models/userModel');
const ExpressError = require('../../utils/expressError');
const handleRequest = require('../../utils/requestHandler');
const { invalidateCache, getFromDbAndCache } = require('../../services/cacheService');

const createKit = handleRequest(async (req) => {
  const { userId } = req.params;
  if (!userId) throw new ExpressError('User ID not provided', 400);
  const kit = new KitModel(req.body);
  kit.createdBy = userId;

  // Add the first sound from the sounds collection to the kit
  const sound = await SoundModel.findOne();
  if (!sound) throw new ExpressError('No sounds found', 404);
  kit.sounds.push(sound._id);

  await kit.save();

  // Add the created kit to the user's kits array
  const user = await UserModel.findById(userId);
  if (!user) throw new ExpressError('User not found', 404);
  if (!user.kits) user.kits = [];

  user.kits.push(kit._id);
  await user.save();

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
  if (!kit) throw new ExpressError('Kit not found', 404);

  const prevKit = await KitModel.findOne({ _id: { $lt: kitId } })
    .sort({ _id: -1 })
    .limit(1);

  const nextKit = await KitModel.findOne({ _id: { $gt: kitId } })
    .sort({ _id: 1 })
    .limit(1);

  return {
    kit,
    prevKit,
    nextKit,
  };
});

const getKitSounds = handleRequest(async (req) => {
  const { kitId } = req.params;

  const kit = await KitModel.findById(kitId);
  if (!kit) throw new ExpressError('Kit not found', 404);

  const sounds = await SoundModel.find({ _id: { $in: kit.sounds } });
  if (!sounds) throw new ExpressError('No sounds found for this kit', 404);

  sounds.sort((a, b) => a.updatedAt - b.updatedAt);

  return sounds;
});

const updateKitSounds = handleRequest(async (req) => {
  const { kitId } = req.params;
  if (!kitId) throw new ExpressError('Kit ID not found', 404);

  const kit = await KitModel.findById(kitId);
  if (!kit) throw new ExpressError('Kit not found', 404);

  const { sounds } = req.body;
  if (!sounds || !Array.isArray(sounds)) throw new ExpressError('Invalid request body', 400);

  if (kit.sounds) kit.sounds = [];

  const updatedSounds = await SoundModel.find({ _id: { $in: sounds } }).select('_id');
  const updatedSoundIds = updatedSounds.map((sound) => sound._id);

  // Update the sounds for the kit
  kit.sounds = updatedSoundIds;

  await kit.save().catch((err) => {
    console.error(err);
    throw new ExpressError('Failed to save changes to kit', 500);
  });

  return kit.sounds;
});

const updateKitById = handleRequest(async (req) => {
  const { kitId } = req.params;

  const existingKit = await KitModel.findById(kitId);
  if (!existingKit) throw new ExpressError('Kit not found', 404);

  const updatedKit = await KitModel.findByIdAndUpdate(kitId, req.body, {
    new: true,
  });
  // Invalidate the cache for the kit using its name
  invalidateCache(kitId);
  // Update the cache with the new data
  await getFromDbAndCache(kitId, (forceUpdate = true));
  return updatedKit;
});

const deleteKitById = handleRequest(async (req) => {
  const { kitId } = req.params;

  const existingKit = await KitModel.findById(kitId);
  if (!existingKit) throw new ExpressError('Kit not found', 404);

  await KitModel.findByIdAndDelete(kitId);
  invalidateCache(kitId);
  return null;
});

module.exports = {
  createKit,
  getAllKits,
  getKitById,
  getKitSounds,
  updateKitSounds,
  updateKitById,
  deleteKitById,
};
