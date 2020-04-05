const Message = require('../models/message');
const Student = require('../models/student');

const notif = require('../../server/services/notifications')

const { GraphQLDateTime } = require("graphql-iso-date");

const Pusher = require('pusher');

const channels_client = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  encrypted: true
});

// Provide resolver functions for the GraphQL schema
const resolvers = {
  DateTime: GraphQLDateTime,

  /**
   * A GraphQL Query for messages that uses a Message model to query MongoDB
   * and get all Message documents.
   */
  Query: {
    messages: () => Message.find({}).populate('student').sort({ createdAt: 'desc' }),

    messagesSentByStudent: (parent, { student }) => {
      const messages = Message.find({ student, "sentAt": { $ne: null } }).sort({ createdAt: 'desc' }).populate('student')

      return messages;
    }
  },
  /**
   * A GraphQL Mutation that provides functionality for adding message to
   * the messages list and return message after successfully adding to list
   */
  Mutation: {
    sendMessageBatch: (root, { message }, context, info) => {
      const { title, body, students, scheduledFor } = message;

      const start = async () => {
        const messages = [];

        await asyncForEach(students, async (student) => {
          const student1 = await Student.findOne(student).populate("device"); // TODO Find a better solution. It's going to DB many times

          const dataMsg = {
            title,
            body,
            student: student1,
            createdAt: new Date().toISOString(),
            scheduledFor,
            isRead: false,
            isDownloaded: false,
            isArchived: false,

            // There is no scheduledFor means the notification should be send now
            sentAt: scheduledFor ? null : new Date().toISOString()
          }

          const newMessage = await new Message(dataMsg).save();
          messages.push(newMessage)

          student1.messages.push(newMessage)
          await student1.save();

          channels_client.trigger(process.env.PUSHER_MSA_MESSAGE_CHANNEL, `msa.message.student.${student1._id}`, {
            "message": "New message to student=" + student1._id
          }, null, () => {

            // There is no scheduledFor means the notification should be send now
            if (!scheduledFor && student1.device) notif.sendNotification(student1.device.token, title);
          });


        });
        return messages;
      }
      return start();
    },

    deleteMessage: async (root, { _id }, context, info) => {
      const message = await Message.findById(_id).populate('student');

      await Student.updateOne({ _id: message.student.id }, { $pull: { messages: message.id } })
      return await Message.findByIdAndDelete(_id);
    },

    deleteMessages: async (root, { _ids }, context, info) => {
      await _ids.forEach(async _id => {
        const message = await Message.findById(_id).populate('student');
        if (message) {
          await Student.updateOne({ _id: message.student.id }, { $pull: { messages: message.id } })
          await Message.findByIdAndDelete(_id);
        }
      })
    },

    setMessageAsRead: async (root, { _id }, context, info) => {
      return await Message.updateMany({ _id }, { isRead: true });
    },
  }
};

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

module.exports = resolvers;