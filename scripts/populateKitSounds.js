const mongoose = require('mongoose');
const { KitModel } = require('../models/kitModel');

async function populateKitSounds() {
  const kitId = '64e61e8b7aecdc67f8632331';
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
      new mongoose.Types.ObjectId('6538c7f2160b633fe14036b6'),
      new mongoose.Types.ObjectId('6538c7f2160b633fe14036b2'),
      new mongoose.Types.ObjectId('6538c7f2160b633fe14036bc'),
      new mongoose.Types.ObjectId('6538c7f2160b633fe14036c0'),
      new mongoose.Types.ObjectId('6538c7f2160b633fe14036c7'),
      new mongoose.Types.ObjectId('6538c7f2160b633fe14036b8'),
      new mongoose.Types.ObjectId('6538c7f2160b633fe14036ba'),
      new mongoose.Types.ObjectId('6538c7f2160b633fe14036b4'),
      new mongoose.Types.ObjectId('6538c7f2160b633fe14036b0'),
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
