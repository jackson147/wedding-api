const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const TestInsert = new Schema({
  author: ObjectId,
  title: String,
  body: String,
  date: Date
});

mongoose.model('TestInsert', TestInsert);