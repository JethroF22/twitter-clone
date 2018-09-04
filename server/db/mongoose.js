const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;

mongoose.connect(
  uri,
  () => {
    console.log(`Connected to DB at ${uri}`);
  }
);

module.exports = mongoose;
