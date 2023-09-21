const mongoose = require('mongoose');
const { UserModel } = require('../models/userModel'); // Adjust the path
const { KitModel } = require('../models/kitModel'); // Adjust the path

async function addKitsToUser() {
  try {
    await mongoose.connect('mongodb://localhost:27017/appdb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Fetch the user by its ID
    const user = await UserModel.findById('64e61e8b7aecdc67f8632357');

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
    // Close the Mongoose connection when you're done
    await mongoose.connection.close();
  }
}

addKitsToUser();
