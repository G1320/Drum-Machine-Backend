const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const soundSchema = new mongoose.Schema({
  _id: { type: ObjectId, required: false },
  title: { type: String, required: false },
  author: { type: String, required: false },
  img: { type: String, required: false },
});

const kitSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subscribers: { type: Number, required: true },
  description: { type: String, required: true },
  sounds: [soundSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const KitModel = mongoose.model('Kit', kitSchema);

module.exports = { KitModel };
