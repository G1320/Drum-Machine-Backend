const mongoose = require('mongoose');
const { CategoryModel } = require('../models/categoryModel');
const { UserModel } = require('../models/userModel');
const connectToDb = require('../db/mongoose');
const path = require('path');
const { readAndParseJsonFile } = require('../utils/fileUtils');

async function importDocument(model, item, uniqueField) {
  const query = { [uniqueField]: item[uniqueField] };
  const existingDoc = await model.findOne(query);
  if (existingDoc) {
    console.log(`Document with ${uniqueField} ${item[uniqueField]} already exists.`);
    return;
  }
  const doc = await model.create(item);
  console.log('Inserted document:', doc);
}

async function importData(model, filePath, uniqueField) {
  const jsonData = readAndParseJsonFile(filePath);
  const dataArray = Object.values(jsonData);

  for (const item of dataArray) {
    await importDocument(model, item, uniqueField);
  }
}

async function main() {
  try {
    await connectToDb();
    await importData(CategoryModel, path.join(__dirname, '../data/categories.json'), 'name');
    await importData(UserModel, path.join(__dirname, '../data/users.json'), 'username');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    mongoose.connection.close();
  }
}

main().catch(console.error);
