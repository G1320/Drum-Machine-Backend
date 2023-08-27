const mongoose = require('mongoose');
const { CategoryModel } = require('../models/categoryModel');
const { UserModel } = require('../models/userModel');
const connectToDb = require('../db/mongoose');
const fs = require('fs');
const path = require('path');

async function exportDocument(model, filePath) {
  const data = await model.find({});
  if (!data || data.length === 0) {
    console.log(`No documents found for export in model: ${model.modelName}`);
    return;
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Exported ${data.length} documents to ${filePath}`);
}

async function exportData(model, filePath) {
  try {
    await exportDocument(model, filePath);
  } catch (err) {
    console.error(`Error exporting data to ${filePath}:`, err);
  }
}

async function main() {
  try {
    await connectToDb();
    await exportData(CategoryModel, path.join(__dirname, '../data/categories-export.json'));
    await exportData(UserModel, path.join(__dirname, '../data/users-export.json'));
  } catch (err) {
    console.error('Error:', err);
  } finally {
    mongoose.connection.close();
  }
}

main().catch(console.error);
