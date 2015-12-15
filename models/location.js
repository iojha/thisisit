// Load MongoDB driver
var mongoose = require('mongoose');

// Define our location schema
var LocationSchema = new mongoose.Schema({
  longitude: Number,
  latitude: Number,
  message: String,
  city: String,
  userId: String
});

// We bind the model to the schema
module.exports = mongoose.model('Location', LocationSchema);
