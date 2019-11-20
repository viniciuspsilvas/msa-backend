const { Schema, model } = require('mongoose');

const schema = new Schema({
  name: String,
  email: String,
  firstname: String,
  lastname: String,
  fullname: String,
  phone: String,
  username: String,
  password: String,

  advices : [{ type: Schema.Types.ObjectId, ref: 'Advice' }],
  enrollments : [{ type: Schema.Types.ObjectId, ref: 'Enrollment' }],

  messages : [{ type: Schema.Types.ObjectId, ref: 'Message' }],

});

module.exports = model('Student', schema);