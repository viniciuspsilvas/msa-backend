const Enrollment = require('../models/enrollment');

const Student = require('../models/student');
const Course = require('../models/course');

// Provide resolver functions for the GraphQL schema
const resolvers = {
  /**
   * A GraphQL Query for enrollments that uses a Enrollment model to query MongoDB
   * and get all Enrollment documents.
   */
  Query: {
    enrollments: () => Enrollment.find({}).populate('student').populate('course')
  },
  /**
   * A GraphQL Mutation that provides functionality for adding enrollment to
   * the enrollments list and return enrollment after successfully adding to list
   */
  Mutation: {
    createEnrollment: async (root, args, context, info) => {
      const { student, course } = args.input;

      if (await Enrollment.countDocuments({ student, course }) > 0) {
        throw new Error('There is already an enrollment for this student in the course.');
      }

      const student1 = await Student.findOne(student);
      const course1 = await Course.findOne(course);

      const newEnrollment = await new Enrollment({ student: student1, course: course1 }).save();

      student1.enrollments.push(newEnrollment)
      await student1.save();

      course1.enrollments.push(newEnrollment)
      await course1.save();

      return newEnrollment;
    },

    deleteEnrollment: async (root, args, context, info) => {
      const { _id } = args;

      const enrollment = await Enrollment.findById(_id).populate('student').populate('course');

      if (enrollment) {
        await Course.updateOne({ _id: enrollment.course.id }, { $pull: { enrollments: enrollment.id } })
        await Student.updateOne({ _id: enrollment.student.id }, { $pull: { enrollments: enrollment.id } })
        return await Enrollment.findByIdAndDelete(_id);
      } else {
        throw new Error(`There is no enrollment with id='${_id}'`);
      }
    },
  }
};

module.exports = resolvers;