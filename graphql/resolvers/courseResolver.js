const Course = require('../models/course');

// Provide resolver functions for the GraphQL schema
const resolvers = {
  /**
   * A GraphQL Query for courses that uses a Course model to query MongoDB
   * and get all Course documents.
   */
  Query: {
    courses: async () => {
      const courseList = await Course.find({})
        .populate({
          path: 'enrollments',
          populate: {
            path: 'student',
           // match: { isActive: true },
          }
        });

      return courseList;
    }
  },
  /**
   * A GraphQL Mutation that provides functionality for adding course to
   * the courses list and return course after successfully adding to list
   */
  Mutation: {
    createCourse: (root, args, context, info) => {

      const course = args.input;
      const newCourse = new Course({ name: course.name, description: course.description });
      return newCourse.save();
    },

    deleteCourse: async (parent, _id) => {
      var course = await Course.findById(_id);

      if (course.enrollments && course.enrollments.length > 0) {
        throw `Course '${course.name}' has ${course.enrollments.length} enrollments.`
      }

      return await Course.findByIdAndDelete(_id);
    },

    updateCourseNameDesc: async (parent, { _id, name, description }) => {
      return await Course.findByIdAndUpdate(_id, { name: name, description: description }, { new: true });
    }
  }
};

module.exports = resolvers;