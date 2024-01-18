const { SongModel } = require('../../models/songModel');
const { UserModel } = require('../../models/userModel');
const { KitModel } = require('../../models/kitModel');
const handleRequest = require('../../utils/requestHandler');
const ExpressError = require('../../utils/expressError');
const { arraysEqual } = require('../../utils/compareArrays');

const createAndAddSongToUser = handleRequest(async (req) => {
  const { userId, name, pattern, kitId } = req.body;
  const user = await UserModel.findById(userId).populate('songs');
  if (!user) throw new ExpressError('User not found', 404);

  const kit = await KitModel.findById(kitId);
  if (!kit) throw new ExpressError('Kit not found', 404);

  // Check for existing song with same pattern and kit
  const existingSong = user.songs.find(
    (song) => song.kit.toString() === kitId && arraysEqual(song.pattern, pattern)
  );

  if (existingSong) throw new ExpressError('No changes were made, please try again', 400);
  if (user.songs.length >= 4) throw new ExpressError('Maximum number of songs reached!', 400);

  const song = new SongModel({ name, pattern, kit: kitId, createdBy: userId });
  await song.save();

  user.songs.push(song._id);
  await user.save();

  return song;
});

const getUserSongs = handleRequest(async (req) => {
  const user = await UserModel.findById(req.params.userId).populate('songs');

  if (!user) throw new ExpressError('User not found', 404);
  if (!user.songs) user.songs = [];
  return user.songs;
});

const updateUserSong = handleRequest(async (req) => {
  const { songId } = req.params;
  const { name, pattern, kitId } = req.body;

  const updatedSong = await SongModel.findByIdAndUpdate(
    songId,
    { name, pattern, kit: kitId },
    { new: true }
  );
  if (!updatedSong) throw new ExpressError('Song not found', 404);
  return updatedSong;
});

const deleteUserSong = handleRequest(async (req) => {
  const { userId, songId } = req.params;

  const deletedSong = await SongModel.findByIdAndDelete(songId);
  if (!deletedSong) throw new ExpressError('Song not found', 404);

  const user = await UserModel.findById(userId);
  if (!user) throw new ExpressError('User not found', 404);

  user.songs.pull(songId);
  await user.save();
  return deletedSong;
});

module.exports = {
  createAndAddSongToUser,
  getUserSongs,
  updateUserSong,
  deleteUserSong,
};
