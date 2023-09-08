const { UserModel } = require('../../models/userModel');
const handleRequest = require('../../utils/requestHandler');
const ExpressError = require('../../utils/expressError');

const createUser = handleRequest(async (req) => {
  const user = new UserModel(req.body);
  await user.save();
  return user;
});

const getAllUsers = handleRequest(async () => {
  return await UserModel.find({});
});

const updateUser = handleRequest(async (req) => {
  const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!user) {
    throw new ExpressError('User not found', 404);
  }
  return user;
});

const deleteUser = handleRequest(async (req) => {
  const user = await UserModel.findByIdAndDelete(req.params.id);
  if (!user) {
    throw new ExpressError('User not found', 404);
  }
  // Using the "null" return to signify a 204 No Content response
  return null;
});

module.exports = {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
};
