const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    avatar: { type: String }, // URL to user's avatar
    password: { type: String, select: false },
    isAdmin: { type: Boolean, default: false },
    kits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Kit' }],
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }], // Array of song references
  },
  { timestamps: true }
);

// Middleware to hash the password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const UserModel = mongoose.model('User', userSchema);

module.exports = { UserModel };
