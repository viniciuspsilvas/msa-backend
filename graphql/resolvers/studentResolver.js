const Student = require('../models/student');
const Advice = require('../models/advice');
const Device = require('../models/device');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { AuthenticationError } = require('apollo-server');

// Provide resolver functions for the GraphQL schema
const resolvers = {
  /**
   * A GraphQL Query for students that uses a Student model to query MongoDB
   * and get all Student documents.
   */
  Query: {
    students: () => {
      const students = Student.find({})
        .populate({
          path: 'enrollments',
          populate: {
            path: 'course',
          }
        })

      return students;
    },
    studentByID: (parent, { _id }) => {
      const student = Student.findById(_id)
        .populate({
          path: 'enrollments',
          populate: {
            path: 'course',
          }
        })

      return student;
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
        phone: student.phone,
        username: student.username,

      });

      return newStudent.save();
    },

    /**********************************/
    /** deleteStudent implementation  */
    /**********************************/
    deleteStudent: async (parent, _id) => {
      var student = await Student.findById(_id);
      if (student.enrollments && student.enrollments.length > 0) {
        throw `Student [id=${_id}] has ${student.enrollments.length} enrollments.`
      }

      return await Student.findByIdAndDelete(_id);
    },

    /**************************************/
    /** updateStudentName implementation  */
    /**************************************/
    updateStudentName: async (parent, { _id, name }) => {
      return await Student.findOneAndUpdate(_id, { name: name }, { new: true });
    },

    /*********************************/
    /** loginStudent implementation  */
    /*********************************/
    loginStudent: async (parent, { loginInput }, ctx, info) => {

      const { username, password, tokenDevice, nameDevice } = loginInput

      /* Do login on Moodle */
      const URL_LOGIN_MOODLE = `http://${process.env.URL_MOODLE}/login/token.php?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&service=${process.env.LOGIN_SERVICE_MOODLE}`;
      const responseMoodle = await axios.get(URL_LOGIN_MOODLE);
      if (!responseMoodle.data.token) throw new AuthenticationError('Invalid Login');
      /******************** */

      /* Get student from Moodle by login (should be the student email) */
      let URL_GET_STUDENT_MOODLE = `http://${process.env.URL_MOODLE}/webservice/rest/server.php?wstoken=${process.env.TOKEN_MOODLE_WS}&wsfunction=core_user_get_users_by_field&moodlewsrestformat=json&field=email&values[0]=${encodeURIComponent(username)}`
      const respStudentMoodle = await axios.get(URL_GET_STUDENT_MOODLE);
      let studentMoodle = respStudentMoodle.data[0]
      if (!studentMoodle) throw new Error(`Student username=[${username}] not found in Moodle.`);
      /******************** */

      const studentDetails = {
        email: studentMoodle.email,
        firstname: studentMoodle.firstname,
        lastname: studentMoodle.lastname,
        username: studentMoodle.username,
      }

      let student = await Student.findOneAndUpdate({ email: username }, studentDetails)
      /** if the student is not found in MSA-db, it should be include. */
      if (!student) {
        student = await Student.create(studentDetails);
      } else if (!await Device.exists({ "token": tokenDevice, student })) {
        await Device.deleteMany({ student }); // Case the student is doing login with a new device
      }

      const deviceInput = {
        description: nameDevice,
        token: tokenDevice,
        isActive: true,
        student
      }
      const device = await Device.create(deviceInput);
      student.device = device;
      await student.save();

      const token = jwt.sign(
        {
          id: student.id,
          username: student.email,
        },
        process.env.SECRET_TOKEN,
        {
          expiresIn: process.env.TOKEN_EXPIRES_IN, // token will expire in 30days
        },
      )
      return { token, student, device }
    }

  }
};

module.exports = resolvers;