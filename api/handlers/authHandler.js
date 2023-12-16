const { NODE_ENV, JWT_REFRESH_KEY, JWT_SECRET_KEY } = require('../../config');
const { UserModel } = require('../../models/userModel');
const ExpressError = require('../../utils/expressError');
const handleRequest = require('../../utils/requestHandler');
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
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      maxAge: 36000000,
      signed: true,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      maxAge: 604800000,
      signed: true,
    });
    return { accessToken: accessToken, user: user };
  } catch (error) {
    console.error('Error creating and registering user:', error);
    throw new ExpressError('Error during registration', 500);
  }
});

const loginUser = handleRequest(async (req, res) => {
  console.log('req: ', req);
  try {
    const userCred = await UserModel.findOne({ username: req.body.username }).select('password');
    if (!userCred) throw new ExpressError('Invalid username', 400);

    const validPassword = await userCred.comparePassword(req.body.password);
    if (!validPassword) throw new ExpressError('Invalid password', 400);

    const user = await UserModel.findById(userCred._id);
    if (!user) throw new ExpressError('User not found', 404);

    const accessToken = jwt.sign({ _id: user._id }, JWT_SECRET_KEY, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ _id: user._id }, JWT_REFRESH_KEY, { expiresIn: '7d' });

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      signed: true,
      secure: NODE_ENV === 'production',
      maxAge: 36000000,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      signed: true,
      secure: NODE_ENV === 'production',
      maxAge: 604800000,
    });
    return { accessToken: accessToken, user: user };
  } catch (error) {
    console.error('Error logging in user:', error);
    throw new ExpressError('Error during login', 500);
  }
});

const refreshAccessToken = handleRequest(async (req, res) => {
  try {
    const refreshToken = req.signedCookies.refreshToken;
    if (!refreshToken) throw new ExpressError('No refresh token provided', 401);

    const decoded = jwt.verify(refreshToken, JWT_REFRESH_KEY);
    const accessToken = jwt.sign({ _id: decoded._id }, JWT_SECRET_KEY, { expiresIn: '15m' });
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      signed: true,
      secure: NODE_ENV === 'production',
      maxAge: 36000000,
    });
    return { accessToken: accessToken };
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw new ExpressError('Error refreshing access token', 500);
  }
});

const logoutUser = handleRequest(async (req, res) => {
  try {
    res.clearCookie('accessToken');
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
  refreshAccessToken,
  logoutUser,
};
