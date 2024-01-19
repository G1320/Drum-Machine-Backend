const { SoundModel } = require('../../models/soundModel');
const { KitModel } = require('../../models/kitModel');
const { SilenceModel } = require('../../models/silenceModel');
const ExpressError = require('../../utils/expressError');
const handleRequest = require('../../utils/requestHandler');

const createSound = handleRequest(async (req) => {
  const sound = new SoundModel(req.body);

  await sound.save();
  return sound;
});

const getSilence = handleRequest(async (req) => {
  const silence = await SilenceModel.find({});
  if (!silence) throw new ExpressError('Silence file not found', 404);
  return silence;
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

  sound.updatedAt = new Date();

  if (!sound.idx) sound.idx = kit.sounds.length;
  await sound.save();

  if (kit.sounds.length > 31) throw new ExpressError('Sorry, Kit is already full!', 400);
  if (kit.sounds.includes(sound._id)) throw new ExpressError('Kit already includes this sound!', 400);

  kit.sounds.push(sound._id);
  await kit.save();

  return sound;
});

const removeSoundFromKit = handleRequest(async (req) => {
  const kitId = req.params.id;
  if (!kitId) throw new ExpressError('Kit ID not provided', 400);

  const soundId = req.params.soundId;
  if (!soundId) throw new ExpressError('sound ID not provided', 400);

  const kit = await KitModel.findById(kitId);
  if (!kit) throw new ExpressError('kit not found', 404);

  const sound = await SoundModel.findById(soundId);
  if (!sound) throw new ExpressError('sound not found', 404);

  kit.sounds.pull(sound._id);
  await kit.save();

  return sound;
});

const getSoundById = handleRequest(async (req) => {
  const { soundId } = req.params;
  if (!soundId) throw new ExpressError('Sound ID not provided', 400);

  const sound = await SoundModel.findById(soundId);
  if (!sound) throw new ExpressError('Sound not found', 404);

  return sound;
});

const updateSoundById = handleRequest(async (req) => {
  const { soundId } = req.params;
  if (!soundId) throw new ExpressError('Sound ID not provided', 400);

  const sound = await SoundModel.findByIdAndUpdate(soundId, req.body, { new: true });
  if (!sound) throw new ExpressError('Sound not found', 404);

  return sound;
});

const deleteSoundById = handleRequest(async (req) => {
  const { soundId } = req.params;
  if (!soundId) throw new ExpressError('Sound ID not provided', 400);

  const sound = await SoundModel.findByIdAndDelete(soundId);
  if (!sound) throw new ExpressError('Sound not found', 404);

  return sound;
});

module.exports = {
  createSound,
  getSounds,
  getSilence,
  getSoundById,
  addSoundToKit,
  removeSoundFromKit,
  updateSoundById,
  deleteSoundById,
};
