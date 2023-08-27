const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  img: { type: String, required: false },
});

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  subscribers: { type: Number, required: true },
  description: { type: String, required: true },
  posts: [postSchema],
});

const CategoryModel = mongoose.model('Category', categorySchema);

module.exports = { CategoryModel };
