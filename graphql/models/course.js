const { Schema, model } = require('mongoose');

const schema = new Schema({
  name: String,
  description: String,
  active: Boolean,

  enrollments : [{ type: Schema.Types.ObjectId, ref: 'Enrollment' }]
});

module.exports = model('Course', schema);
