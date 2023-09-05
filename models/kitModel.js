const mongoose = require('mongoose');

const soundSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  img: { type: String, required: false },
});

const kitSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subscribers: { type: Number, required: true },
  description: { type: String, required: true },
  sounds: [soundSchema],
});

const KitModel = mongoose.model('Kit', kitSchema);

module.exports = { KitModel };
