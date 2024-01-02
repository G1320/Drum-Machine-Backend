const mongoose = require('mongoose');
const { DB_URL, NODE_ENV } = require('../config/index.js');

const connectToDb = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log('Already connected to the database');
      return;
    }

    // const dbUrl = NODE_ENV === 'development' ? DB_URL : 'mongodb://127.0.0.1:27017/appdb';

    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Database connected');
  } catch (error) {
    console.error('Connection error', error);
    process.exit(1);
  }
};

mongoose.connection.on('connected', () => console.log('Mongoose connected'));
mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected'));
mongoose.connection.on('reconnected', () => console.log('Mongoose reconnected'));
mongoose.connection.on('error', (err) => console.log('Mongoose connection error:', err));

module.exports = connectToDb;
