const Advice = require('../models/advice');
const Student = require('../models/student');

// Provide resolver functions for the GraphQL schema
const resolvers = {
  /**
   * A GraphQL Query for advices that uses a Advice model to query MongoDB
   * and get all Advice documents.
   */
  Query: {
    advices: () => Advice.find({}).populate('student')
  },
  /**
   * A GraphQL Mutation that provides functionality for adding advice to
   * the advices list and return advice after successfully adding to list
   */
  Mutation: {
    createAdvice: async (root, args, context, info) => {
      const { description, student, token } = args.input;

      const student1 = await Student.findOne(student);
      const newAdvice = await new Advice({ description, token, isActive: true, student: student1 }).save();

      student1.advices.push(newAdvice)
      await student1.save();

      return newAdvice;
    },

    deleteAdvice: async (root, args, context, info) => {
      const { id } = args;
      const advice = await Advice.findById(id).populate('student');

      await Student.updateOne({ _id: advice.student.id }, { $pull: { advices: advice.id } })
      return await Advice.findByIdAndDelete(id);
    },
  }
};

module.exports = resolvers;