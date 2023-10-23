const mongoose = require('mongoose');
const { UserModel } = require('../models/userModel');

async function addKitsToUser() {
  const userId = '6513db1ef0661f537cf22d34';
  try {
    await mongoose.connect('mongodb://localhost:27017/appdb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const user = await UserModel.findById(userId);

    if (!user) {
      console.error('User not found');
      return;
    }
    const kitIdsToAdd = [
      new mongoose.Types.ObjectId('64e61e8b7aecdc67f8632329'),
      new mongoose.Types.ObjectId('64e61e8b7aecdc67f8632331'),
    ];
    user.kits.push(...kitIdsToAdd);

    await user.save();

    console.log('User with kits:', JSON.stringify(user, null, 2));
  } catch (error) {
    console.error('Error adding kits to user:', error);
  } finally {
    await mongoose.connection.close();
  }
}

addKitsToUser();
