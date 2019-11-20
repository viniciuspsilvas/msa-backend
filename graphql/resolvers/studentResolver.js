const Student = require('../models/student');

// Provide resolver functions for the GraphQL schema
const resolvers = {
  /**
   * A GraphQL Query for students that uses a Student model to query MongoDB
   * and get all Student documents.
   */
  Query: {
    students: () => {
      var students =  Student.find({})
      .populate({ 
        path: 'enrollments',
        populate: {
          path: 'course',
        } 
     })

      return students;
    }
  },
  /**
   * A GraphQL Mutation that provides functionality for adding student to
   * the students list and return student after successfully adding to list
   */
  Mutation: {
    createStudent: (root, args, context, info) => {
      const student = args.input;

      const newStudent = new Student({
        name: student.name,
        email: student.email,
        firstname: student.firstname,
        lastname: student.lastname,
        fullname: student.fullname,
        phone: student.phone,
        username: student.username,
        password: student.password,

      });

      return newStudent.save();
    },

    deleteStudent: async (parent, _id) => {
      var student = await Student.findById(_id);
      if (student.enrollments && student.enrollments.length > 0) {
        throw `Student [id=${_id}] has ${student.enrollments.length} enrollments.`
      }

      return await Student.findByIdAndDelete(_id);
    },

    updateStudentName: async (parent, { _id, name }) => {
      return await Student.findOneAndUpdate(_id, { name: name }, { new: true });
    }
  }
};

module.exports = resolvers;