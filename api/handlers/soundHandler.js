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

  await sound.save();
  console.log('sound: ', sound);

  if (kit.sounds.length > 31) throw new ExpressError('Oops, Kit is full!', 400);
  if (kit.sounds.includes(sound._id)) throw new ExpressError('Kit already includes this sound!', 400);

  // kit.sounds.push(sound._id);
  kit.sounds.push({ idx: kit.sounds.length + 1, soundId: sound._id });
  await kit.save();
  console.log('kit.sounds: ', kit.sounds);

  return sound;
});

const removeSoundFromKit = handleRequest(async (req) => {
  const kitId = req.params.id;
  if (!kitId) throw new ExpressError('Kit ID not provided', 400);

  const soundIdToRemove = req.params.soundId;
  if (!soundIdToRemove) throw new ExpressError('Sound ID not provided', 400);

  const kit = await KitModel.findById(kitId);
  if (!kit) throw new ExpressError('Kit not found', 404);

  // Find the index of the sound with the specified soundId in kit.sounds
  const soundIndex = kit.sounds.findIndex((sound) => sound.soundId.equals(soundIdToRemove));

  if (soundIndex === -1) {
    throw new ExpressError('Sound not found in the kit', 404);
  }

  // Remove the sound at the found index
  kit.sounds.splice(soundIndex, 1);

  // Re-map the idx values for the remaining sounds
  kit.sounds.forEach((sound, index) => (sound.idx = index));

  // Save the kit
  await kit.save();

  return soundIdToRemove; // Return the removed soundId
});

// const removeSoundFromKit = handleRequest(async (req) => {
//   const kitId = req.params.id;
//   if (!kitId) throw new ExpressError('Kit ID not provided', 400);

//   const soundIdToRemove = req.params.soundId;
//   if (!soundIdToRemove) throw new ExpressError('Sound ID not provided', 400);

//   const kit = await KitModel.findById(kitId);
//   if (!kit) throw new ExpressError('Kit not found', 404);

//   // Find the index of the sound with the specified soundId in kit.sounds
//   const soundIndex = kit.sounds.findIndex((sound) => sound.soundId.equals(soundIdToRemove));

//   if (soundIndex === -1) {
//     throw new ExpressError('Sound not found in the kit', 404);
//   }

//   // Remove the sound at the found index
//   kit.sounds.splice(soundIndex, 1);

//   // Save the kit
//   await kit.save();

//   return soundIdToRemove; // Return the removed soundId
// });

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
