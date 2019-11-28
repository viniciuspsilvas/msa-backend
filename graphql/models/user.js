const { Schema, model } = require('mongoose');

const schema = new Schema({
  username: String,
  password: String,

  isActive: Boolean,
  isAdmin: Boolean,
});

module.exports = model('User', schema);