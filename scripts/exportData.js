const mongoose = require('mongoose');
const { SoundsModel } = require('../models/soundsModel');
const { KitModel } = require('../models/kitModel');
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

async function main() {
  try {
    await connectToDb();

    await exportDocument(SoundsModel, path.join(__dirname, '../data/sounds.json'));
    await exportDocument(KitModel, path.join(__dirname, '../data/categories-export.json'));
    await exportDocument(UserModel, path.join(__dirname, '../data/users-export.json'));
  } catch (err) {
    console.error('Error:', err);
  } finally {
    mongoose.connection.close();
  }
}

main().catch(console.error);
