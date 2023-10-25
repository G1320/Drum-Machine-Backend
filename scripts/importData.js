const mongoose = require('mongoose');
const { KitModel } = require('../models/kitModel');
const { UserModel } = require('../models/userModel');
const { SoundModel } = require('../models/soundModel');
const connectToDb = require('../db/mongoose');
const path = require('path');
const { readAndParseJsonFile } = require('../utils/fileUtils');

async function importDocument(model, item, uniqueField) {
  try {
    const query = { [uniqueField]: item[uniqueField] };
    const existingDoc = await model.findOne(query);
    if (existingDoc) {
      console.log(`Document with ${uniqueField} ${item[uniqueField]} already exists.`);
      return;
    }
    const doc = await model.create(item);
    console.log('Inserted document:', doc);
  } catch (error) {
    console.error(`Error importing document with ${uniqueField} ${item[uniqueField]}:`, error);
  }
}

async function importData(model, filePath, uniqueField) {
  const jsonData = readAndParseJsonFile(filePath);
  const dataArray = Object.values(jsonData);

  const importPromises = dataArray.map((item) => importDocument(model, item, uniqueField));
  await Promise.all(importPromises);
}

async function main() {
  try {
    await connectToDb();
    await importData(SoundModel, path.join(__dirname, '../data/sounds.json'), 'src');
    // await importData(KitModel, path.join(__dirname, '../data/kits-export.json'), 'name');
    // await importData(UserModel, path.join(__dirname, '../data/users.json'), 'username');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    mongoose.connection.close();
  }
}

main().catch(console.error);
