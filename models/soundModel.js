const mongoose = require('mongoose');

const soundSchema = new mongoose.Schema({
  keyCode: { type: String, required: false },
  title: { type: String, required: false },
  src: { type: String, required: false },
  img: { type: String, required: false },
  kits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Kit' }],
  // idx: { type: Number, required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const SoundModel = mongoose.model('Sound', soundSchema);

module.exports = { SoundModel };
