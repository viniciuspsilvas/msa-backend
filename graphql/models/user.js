const { Schema, model } = require('mongoose');

const schema = new Schema({
  email: String,
  password: String,

});

module.exports = model('User', schema);