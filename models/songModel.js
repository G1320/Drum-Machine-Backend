const mongoose = require('mongoose');

const songSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    pattern: [{ type: String }], // Array of cell IDs
    kit: { type: mongoose.Schema.Types.ObjectId, ref: 'Kit' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tempo: { type: Number, default: 120 },
    volume: { type: Number, default: 1 },
    selectedCells: { type: Array, default: [] },
    mutedTracks: { type: Array, default: [] },
    numOfSteps: { type: Number, default: 16 },
  },
  { timestamps: true }
);

const SongModel = mongoose.model('Song', songSchema);

module.exports = { SongModel };
