const Message = require('../models/message');
const Student = require('../models/student');

// Provide resolver functions for the GraphQL schema
const resolvers = {
  /**
   * A GraphQL Query for messages that uses a Message model to query MongoDB
   * and get all Message documents.
   */
  Query: {
    messages: () => Message.find({}).populate('student')
  },
  /**
   * A GraphQL Mutation that provides functionality for adding message to
   * the messages list and return message after successfully adding to list
   */
  Mutation: {
    sendMessageBatch: async (root, args, context, info) => {
      const { title, body, students, scheduledFor } = args.input;

      students.forEach(async (student) => {
        const student1 = await Student.findOne(student); // TODO Find a better solution. It's going to DB many times

        const dataMsg = {
          title,
          body,
          student: student1,
          createdAt: new Date().toISOString(),
          scheduledFor,
          isRead: false,
          isDownloaded: false,
          isArchived: false,
        }

        const newMessage = await new Message(dataMsg).save();
        student1.messages.push(newMessage)
        await student1.save();
      })

      return args.input;
    },

    deleteMessage: async (root, args, context, info) => {
      const { id } = args;
      const message = await Message.findById(id).populate('student');

      await Student.updateOne({ _id: message.student.id }, { $pull: { messages: message.id } })
      return await Message.findByIdAndDelete(id);
    },
  }
};

module.exports = resolvers;