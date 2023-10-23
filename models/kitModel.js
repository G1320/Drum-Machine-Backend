const mongoose = require('mongoose');
const { SoundModel } = require('./soundModel');

const kitSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subscribers: { type: Number, required: true },
  description: { type: String, required: true },
  sounds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sound' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const KitModel = mongoose.model('Kit', kitSchema);

module.exports = { KitModel };
