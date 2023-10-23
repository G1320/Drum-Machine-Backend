const mongoose = require('mongoose');
const { KitModel } = require('../models/kitModel');
// const { SoundsModel } = require('../models/soundModel');

async function populateKitSounds() {
  const kitId = '64e61e8b7aecdc67f8632329';
  try {
    await mongoose.connect('mongodb://localhost:27017/appdb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const kit = await KitModel.findById(kitId);

    if (!kit) {
      console.error('Kit not found');
      return;
    }
    const soundIdsToAdd = [
      new mongoose.Types.ObjectId('6530e527d1fcdfacbc674bfe'),
      new mongoose.Types.ObjectId('6530e527d1fcdfacbc674bff'),
    ];

    kit.sounds.push(...soundIdsToAdd);
    await kit.save();

    console.log('Kit with sound IDs:', JSON.stringify(kit, null, 2));
  } catch (error) {
    console.error('Error populating kit sounds:', error);
  } finally {
    await mongoose.connection.close();
  }
}

populateKitSounds();
