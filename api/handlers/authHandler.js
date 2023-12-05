const { NODE_ENV, JWT_REFRESH_KEY, JWT_SECRET_KEY } = require('../../config');
const { UserModel } = require('../../models/userModel');
const handleRequest = require('../../utils/requestHandler');
const ExpressError = require('../../utils/expressError');
const jwt = require('jsonwebtoken');

const createAndRegisterUser = handleRequest(async (req, res) => {
  try {
    const user = new UserModel(req.body);
    await user.save();

    const accessToken = jwt.sign({ _id: user._id }, JWT_SECRET_KEY, {
      expiresIn: '15m',
    });
    const refreshToken = jwt.sign({ _id: user._id }, JWT_REFRESH_KEY, {
      expiresIn: '7d',
    });
    res.cookie('authToken', accessToken, {
      httpOnly: true,
      // secure: NODE_ENV !== 'development',
      maxAge: 36000000,
      signed: true,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      // secure: NODE_ENV !== 'development',
      maxAge: 604800000,
      signed: true,
    });
    return { authToken: accessToken, user: user };
  } catch (error) {
    console.error('Error creating and registering user:', error);
    throw new ExpressError('Error during registration', 500);
  }
});

const loginUser = handleRequest(async (req, res) => {
  try {
    const userCred = await UserModel.findOne({ username: req.body.username }).select('password');
    if (!userCred) throw new ExpressError('Invalid username', 400);

    const validPassword = await userCred.comparePassword(req.body.password);
    if (!validPassword) throw new ExpressError('Invalid password', 400);

    const user = await UserModel.findById(userCred._id);
    const accessToken = jwt.sign({ _id: user._id }, JWT_SECRET_KEY, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ _id: user._id }, JWT_REFRESH_KEY, { expiresIn: '7d' });
    res.cookie('authToken', accessToken, {
      httpOnly: true,
      signed: true,
      // secure: NODE_ENV !== 'development',
      maxAge: 36000000,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      signed: true,
      // secure: NODE_ENV !== 'development',
      maxAge: 604800000,
    });
    return { authToken: accessToken, user: user };
  } catch (error) {
    console.error('Error logging in user:', error);
    throw new ExpressError('Error during login', 500);
  }
});

const logoutUser = handleRequest(async (req, res) => {
  try {
    res.clearCookie('authToken');
    res.clearCookie('refreshToken');
    return { message: 'Logged out successfully' };
  } catch (error) {
    console.error('Failed to clear authentication cookie:', error);
    throw new ExpressError('Logout failed', 500);
  }
});

module.exports = {
  createAndRegisterUser,
  loginUser,
  logoutUser,
};
