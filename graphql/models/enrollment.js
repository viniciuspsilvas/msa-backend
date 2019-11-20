const { Schema, model } = require('mongoose');

const schema = new Schema({
  student: {type: Schema.Types.ObjectId, ref: 'Student'},
  course: {type: Schema.Types.ObjectId, ref: 'Course'},
});

module.exports = model('Enrollment', schema);
