const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Guest = new Schema({
  author: ObjectId,
  name: String,
  attending: String,
  day: Boolean,
  gluten: String,
  starter: String,
  main: String,
  dessert: String,
  passcode: String
});

mongoose.model('Guest', Guest);