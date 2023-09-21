const { UserModel } = require('../../models/userModel');
const handleRequest = require('../../utils/requestHandler');
const ExpressError = require('../../utils/expressError');
const jwt = require('jsonwebtoken');

const createAndRegisterUser = handleRequest(async (req) => {
  const user = new UserModel(req.body);
  await user.save();
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY);
  return { user, token };
});

const getUserDetails = handleRequest(async (req) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const user = await UserModel.findById(decoded._id);

  if (!user) {
    throw new ExpressError('User not found', 404);
  }

  return user;
});

const loginUser = handleRequest(async (req) => {
  const user = await UserModel.findOne({ username: req.body.username }).select('password');
  console.log(user);
  if (!user) throw new ExpressError('Invalid username or password', 400);

  const validPassword = await user.comparePassword(req.body.password);
  console.log(req.body);
  if (!validPassword) throw new ExpressError('Invalid password', 400);

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY);
  return { token };
});

module.exports = {
  createAndRegisterUser,
  loginUser,
  getUserDetails,
};
