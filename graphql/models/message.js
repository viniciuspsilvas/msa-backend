const { Schema, model } = require('mongoose');

const schema = new Schema({

  title: String,
  body: String,
  createdAt: Date,
  sentAt: Date,
  scheduledFor: Date,
  isRead: Boolean,
  isDownloaded: Boolean,
  isArchived: Boolean,

  student: {type: Schema.Types.ObjectId, ref: 'Student'},
});

module.exports = model('Message', schema);
