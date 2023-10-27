const { SoundModel } = require('../../models/soundModel');
const { KitModel } = require('../../models/kitModel');
const ExpressError = require('../../utils/expressError');
const handleRequest = require('../../utils/requestHandler');

const createSound = handleRequest(async (req) => {
  const sound = new SoundModel(req.body);
  await sound.save();
  return sound;
});

const getSounds = handleRequest(async (req) => {
  let query = SoundModel.find();
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
  const sounds = await query.exec();
  return sounds;
});

const addSoundToKit = handleRequest(async (req) => {
  const kitId = req.params.id;
  if (!kitId) throw new ExpressError('kit ID not provided', 400);

  const soundId = req.params.soundId;
  if (!soundId) throw new ExpressError('sound ID not provided', 400);

  const kit = await KitModel.findById(kitId);
  if (!kit) throw new ExpressError('kit not found', 404);
  if (!kit.sounds) kit.sounds = [];

  const sound = await SoundModel.findById(soundId);
  if (!sound) throw new ExpressError('sound not found', 404);

  if (kit.sounds.length > 8) throw new ExpressError('Kit is already full!', 400);
  if (kit.sounds.includes(sound._id)) {
    throw new ExpressError('Sound already exists in kit!', 400);
  }
  kit.sounds.push(sound._id);
  await kit.save();

  return kit;
});

const removeSoundFromKit = handleRequest(async (req) => {
  const userId = req.params.id;
  if (!userId) throw new ExpressError('User ID not provided', 400);

  const soundId = req.params.soundId;
  if (!soundId) throw new ExpressError('sound ID not provided', 400);

  const user = await UserModel.findById(userId);
  if (!user) throw new ExpressError('User not found', 404);

  const sound = await SoundModel.findById(soundId);
  if (!sound) throw new ExpressError('sound not found', 404);

  user.sounds.pull(sound._id);
  await user.save();

  return user;
});

const getSoundById = handleRequest(async (req) => {
  const { soundId } = req.params;
  const sound = await SoundModel.findById(soundId);
  if (!sound) {
    throw new ExpressError('Sound not found', 404);
  }
  return sound;
});

const updateSoundById = handleRequest(async (req) => {
  const { soundId } = req.params;
  const sound = await SoundModel.findByIdAndUpdate(soundId, req.body, { new: true });
  if (!sound) {
    throw new ExpressError('Sound not found', 404);
  }
  return sound;
});

const deleteSoundById = handleRequest(async (req) => {
  const { soundId } = req.params;
  const sound = await SoundModel.findByIdAndDelete(soundId);
  if (!sound) {
    throw new ExpressError('Sound not found', 404);
  }
  return sound;
});

module.exports = {
  createSound,
  getSounds,
  getSoundById,
  addSoundToKit,
  removeSoundFromKit,
  updateSoundById,
  deleteSoundById,
};
