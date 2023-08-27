const { UserModel } = require('../../models/userModel');
const handleRequest = require('../../utils/requestHandler'); // Adjust the path to point to the shared file

const createUser = handleRequest(async (req) => {
  const user = new UserModel(req.body);
  await user.save();
  return user;
});

const getAllUsers = handleRequest(async () => {
  return await UserModel.find({});
});

const updateUser = handleRequest(async (req, res) => {
  const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!user) {
    return res.status(404).send('User not found');
  }
  return user;
});

const deleteUser = handleRequest(async (req, res) => {
  const user = await UserModel.findByIdAndDelete(req.params.id);
  if (!user) {
    return res.status(404).send('User not found');
  }
  res.status(204).send();
});

module.exports = {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
};
