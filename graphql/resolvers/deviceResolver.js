const Device = require('../models/device');
const Student = require('../models/student');

// Provide resolver functions for the GraphQL schema
const resolvers = {
  /**
   * A GraphQL Query for devices that uses a Device model to query MongoDB
   * and get all Device documents.
   */
  Query: {
    devices: () => Device.find({}).populate('student')
  },
  /**
   * A GraphQL Mutation that provides functionality for adding device to
   * the devices list and return device after successfully adding to list
   */
  Mutation: {
    createAdvice: async (root, args, context, info) => {
      const { description, student, token } = args.input;

      const student1 = await Student.findOne(student);
      const newAdvice = await new Device({ description, token, isActive: true, student: student1 }).save();

      student1.device = newAdvice;
      await student1.save();

      return newAdvice;
    },

    deleteAdvice: async (root, args, context, info) => {
      const { id } = args;
      const device = await Device.findById(id).populate('student');

      await Student.updateOne({ _id: device.student.id }, { device: null })
      return await Device.findByIdAndDelete(id);
    },
  }
};

module.exports = resolvers;