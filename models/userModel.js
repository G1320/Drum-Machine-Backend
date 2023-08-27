const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  avatar: { type: String }, // URL to user's avatar
  password: { type: String, select: false },
  role: { type: String, default: 'user' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Middleware to hash the password before saving
userSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, 10);
  }
  next();
});

// Method to compare password
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const UserModel = mongoose.model('User', userSchema);

module.exports = { UserModel };
