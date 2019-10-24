const { Schema, model } = require('mongoose');

const schema = new Schema({
  name: String,
  description: String,

  enrollments : [{ type: Schema.Types.ObjectId, ref: 'Enrollment' }]
});

module.exports = model('Course', schema);
