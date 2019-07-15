'use strict';

const axios = require('axios');
const app = require('../../server/server');
const passwordHash = require('password-hash');

const urlMoodle = app.get('url-moodle');
let loginServiceMoodle = app.get('login-service-moodle');
let tokenMoodleWS = app.get('token-moodle-WS');


module.exports = function (Student) {

  // description???
  Student.observe('loaded', function (ctx, next) {
    if (ctx.instance) {
      var sum = 0;

      Student.app.models.StudentAdvice.find({
        where: {
          studentId: ctx.instance.id
        },
        fields: {
          givenNumericProperty: true
        }
      }, function (err, studentAdvice) {
        if (err) return next(err);

        if (studentAdvice.length) {
          studentAdvice.forEach(function (model2) {
            sum += model2.givenNumericProperty;
          });

          ctx.instance.calculatedProperty = sum;
        }

        return next();
      });

    } else {
      return next();
    }
  });


  // This method to the login on Moodle Server by API
  Student.loginMoodle = function (userDetails, cb) {
    var { login, password, tokenAdvice, adviceDesc } = userDetails;

    var StudentAdvice = app.models.StudentAdvice;

    // Do login on Moodle
    let urlLoginMoodle = `http://${urlMoodle}/login/token.php?username=${encodeURIComponent(login)}&password=${encodeURIComponent(password)}&service=${loginServiceMoodle}`;

    // Make a request for a user with a given ID
    axios.get(urlLoginMoodle)
      .then(function (responseLogin) {

        // If token isn't null then import user from Moodle to MSA.
        // Otherwise if token == null means that user wasn't found.
        var tokenMoodle = responseLogin.data.token
        if (tokenMoodle) {

          // Get user from Moodle by login (should be the user email)
          let urlGetUserMoodle = `http://${urlMoodle}/webservice/rest/server.php?wstoken=${tokenMoodleWS}&wsfunction=core_user_get_users_by_field&moodlewsrestformat=json&field=email&values[0]=${encodeURIComponent(login)}`

          // Make a request for a user with a given ID
          axios.get(urlGetUserMoodle)
            .then(function (respUser) {

              // Get the fist User received from Moodle
              let userMoodle = respUser.data[0]
              let userData = {
                email: userMoodle.email,
                fullname: userMoodle.fullname,
                firstname: userMoodle.firstname,
                lastname: userMoodle.lastname,
                username: userMoodle.username,
                password: passwordHash.generate(password)
              }

              // Find or create a new Student
              Student.findOrCreate({ where: { email: login } }, userData, function (err, student) {

                if (err) throw err;
                var StudentAdvice = app.models.StudentAdvice;

                let adviceData = {
                  description: adviceDesc,
                  token: tokenAdvice,
                  studentId: student.id
                }
                StudentAdvice.destroyAll({ "token": tokenAdvice }, () => {
                  console.log("StudentAdvice removed. Token: ", tokenAdvice)
                  StudentAdvice.create(adviceData, () => console.log("StudentAdvice criado. Token: ", tokenAdvice, "Student:" + student.id))
                }
                );

                // Find the advices of the user
                cb(null, student)
              });

            })
            .catch(function (err) {
              cb(err)
            })

        } else {
          var error = new Error("New password and confirmation do not match");
          error.status = 400;
          cb(error)
        }

      })
      .catch(function (error) {
        cb(error)
      })
  }

  /*
  // getAttendance API - '/api/Students/getAttendance'
  */
  Student.getAttendance = function (studentId, cb) {

    console.log("### Student.getAttendance - studentId = " + studentId)

    // Get the attendance from Moodle
    cb(null, 0.89); // RETURN
  }
  /*
  // FIM - getAttendance API - '/api/Students/getAttendance'
  */
};
