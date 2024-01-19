const mongoose = require('mongoose');

const SilenceSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  src: {
    type: String,
    required: true,
  },
});

const SilenceModel = mongoose.model('Misc', SilenceSchema);

module.exports = { SilenceModel };
