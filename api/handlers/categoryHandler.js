const { CategoryModel } = require('../../models/categoryModel');
const handleRequest = require('../../utils/requestHandler');

const createCategory = handleRequest(async (req) => {
  const category = new CategoryModel(req.body);
  await category.save();
  return category;
});

const getAllCategories = handleRequest(async () => {
  return await CategoryModel.find();
});

const getCategoryByName = handleRequest(async (req, res) => {
  const { categoryName } = req.params;
  const category = await CategoryModel.findOne({ name: categoryName });
  if (!category) {
    return res.status(404).send('Category not found');
  }
  return category;
});

const updateCategoryByName = handleRequest(async (req, res) => {
  const { categoryName } = req.params;
  const category = await CategoryModel.findOneAndUpdate({ name: categoryName }, req.body, {
    new: true,
  });
  if (!category) {
    return res.status(404).send('Category not found');
  }
  return category;
});

const deleteCategoryByName = handleRequest(async (req, res) => {
  const { categoryName } = req.params;
  const category = await CategoryModel.findOneAndDelete({ name: categoryName });
  if (!category) {
    return res.status(404).send('Category not found');
  }
  res.status(204).send();
});

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryByName,
  updateCategoryByName,
  deleteCategoryByName,
};
