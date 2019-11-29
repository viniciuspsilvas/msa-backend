const { Schema, model } = require('mongoose');

const schema = new Schema({
  name: String,
  email: String,
  firstname: String,
  lastname: String,
  phone: String,
  username: String,
  isActive: Boolean,

  device: { type: Schema.Types.ObjectId, ref: 'Device' },

  advices : [{ type: Schema.Types.ObjectId, ref: 'Advice' }],
  enrollments : [{ type: Schema.Types.ObjectId, ref: 'Enrollment' }],

  messages : [{ type: Schema.Types.ObjectId, ref: 'Message' }],

});

schema.virtual('fullname').get(function () {
  return this.firstname + ' ' + this.lastname;
});

module.exports = model('Student', schema);