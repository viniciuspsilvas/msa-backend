const { Schema, model } = require('mongoose');

const schema = new Schema({

  description: String,
  token: String,
  isActive: Boolean,

  student: {type: Schema.Types.ObjectId, ref: 'Student'},
});

module.exports = model('Advice', schema);
