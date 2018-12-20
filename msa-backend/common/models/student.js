'use strict';

module.exports = function (Student) {

    Student.loginMoodle = function (credencial, cb) {

        var { login, password, tokenAdvice, adviceDesc } = credencial;


        var passwordHash = require('password-hash');

        
        let app = require('../../server/server');
        let urlMoodle = app.get('url-moodle');
        let loginServiceMoodle = app.get('login-service-moodle');
        let urlLoginMoodle = `http://${urlMoodle}/login/token.php?username=${encodeURIComponent(login)}&password=${encodeURIComponent(password)}&service=${loginServiceMoodle}`;

        let tokenMoodleWS = app.get('token-moodle-WS');
        let urlGetUserMoodle = email => `http://${urlMoodle}/webservice/rest/server.php?wstoken=${tokenMoodleWS}&wsfunction=core_user_get_users_by_field&moodlewsrestformat=json&field=email&values[0]=${encodeURIComponent(email)}`

        let headerGET = {
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        };

        // Do login on Moodle
        fetch(urlLoginMoodle, headerGET ).then(resp => resp.json())
            .then(loginReturn => {

                // If token isn't null then import user from Moodle to MSA.
                // Otherwise if token == null means that user wasn't found.
                var token = loginReturn.token
                if (token) {

                    // Get user from Moodle by login (should be the user email)
                    fetch(urlGetUserMoodle(login), headerGET).then(resp => resp.json())
                        .then(listUserMoodle => {

                            // Get the fist User received from Moodle
                            let userMoodle = listUserMoodle[0]

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
                                    description : adviceDesc,
                                    token: tokenAdvice,
                                    studentId: student.id
                                }
                    
                                // Find the advices of the user
                                StudentAdvice.findOrCreate({ where: { "token": tokenAdvice }}, adviceData);
                                cb(null, student)
                            });


                        });

                } else {
                    throw loginReturn.error;
                }

            }).catch(err => cb(err, login))
    }
};
