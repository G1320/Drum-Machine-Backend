// const { MongoClient, ServerApiVersion } = require('mongodb');

// const uri =
//   'mongodb+srv://admin-user:ouPjP0qrN1HZvxe0@cluster0.jlosl6z.mongodb.net/?retryWrites=true&w=majority';
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// const connectToDb = async () => {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db('admin').command({ ping: 1 });
//     console.log('Pinged your deployment. You successfully connected to MongoDB!');
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// };
// connectToDb().catch(console.dir);

const mongoose = require('mongoose');
const { DB_URL, NODE_ENV } = require('../config/index.js');

const connectToDb = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log('Already connected to the database');
      return;
    }

    const dbUrl = NODE_ENV === 'production' ? DB_URL : 'mongodb://127.0.0.1:27017/appdb';
    // console.log('dbUrl: ', dbUrl);

    await mongoose.connect(dbUrl, {
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
