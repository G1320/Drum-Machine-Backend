const { UserModel } = require('../../models/userModel');
const { KitModel } = require('../../models/kitModel');
const handleRequest = require('../../utils/requestHandler');
const ExpressError = require('../../utils/expressError');

const createUser = handleRequest(async (req) => {
  const user = new UserModel(req.body);
  await user.save();
  return user;
});

const getUserKits = handleRequest(async (req) => {
  const user = await UserModel.findById(req.params.id);
  if (!user) throw new ExpressError('User not found', 404);

  const kits = await KitModel.find({ _id: { $in: user.kits } });
  if (!kits) throw new ExpressError('No kits found for this user', 404);

  return kits;
});

const addKitToUser = handleRequest(async (req) => {
  const userId = req.params.id;
  if (!userId) throw new ExpressError('User ID not provided', 400);

  const kitId = req.params.kitId;
  if (!kitId) throw new ExpressError('Kit ID not provided', 400);

  const user = await UserModel.findById(userId);
  if (!user) throw new ExpressError('User not found', 404);

  const kit = await KitModel.findById(kitId);

  if (!kit) throw new ExpressError('Kit not found', 404);
  if (!kit.sounds) kit.sounds = [];
  if (user.kits.includes(kit._id)) throw new ExpressError('Kit already added!', 400);
  // if (kit.sounds.length < 1) throw new ExpressError('Kit is empty, add some sounds first!', 400);

  user.kits.push(kit._id);
  await user.save();

  return kit;
});

const removeKitFromUser = handleRequest(async (req) => {
  const userId = req.params.id;
  if (!userId) throw new ExpressError('User ID not provided', 400);

  const kitId = req.params.kitId;
  if (!kitId) throw new ExpressError('Kit ID not provided', 400);

  const user = await UserModel.findById(userId);
  if (!user) throw new ExpressError('User not found', 404);

  const kit = await KitModel.findById(kitId);
  if (!kit) throw new ExpressError('Kit not found', 404);

  user.kits.pull(kit._id);
  await user.save();

  return kit;
});

const getAllUsers = handleRequest(async () => {
  const users = await UserModel.find({});
  if (!users) throw new ExpressError('No users found', 404);

  return users;
});

const updateUser = handleRequest(async (req) => {
  const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!user) throw new ExpressError('User not found', 404);

  return user;
});

const deleteUser = handleRequest(async (req) => {
  const user = await UserModel.findByIdAndDelete(req.params.id);
  if (!user) throw new ExpressError('User not found', 404);

  // Using the "null" return to signal a 204 No Content response
  return null;
});

module.exports = {
  createUser,
  getUserKits,
  addKitToUser,
  removeKitFromUser,
  getAllUsers,
  updateUser,
  deleteUser,
};
