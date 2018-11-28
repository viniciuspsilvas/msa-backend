'use strict';

module.exports = function (Customuser) {

    Customuser.loginMoodle = function (login, password, cb) {

        let app = require('../../server/server');
        let urlMoodle = app.get('url-moodle');
        let loginServiceMoodle = app.get('login-service-moodle');
        let urlLoginMoodle = `http://${urlMoodle}/login/token.php?username=${encodeURIComponent(login)}&password=${encodeURIComponent(password)}&service=${loginServiceMoodle}`;

        let tokenMoodleWS  = app.get('token-moodle-WS');
        let urlGetUserMoodle = email => `http://${urlMoodle}/webservice/rest/server.php?wstoken=${tokenMoodleWS}&wsfunction=core_user_get_users_by_field&moodlewsrestformat=json&field=email&values[0]=${encodeURIComponent(email)}`

        // Do login on Moodle
        fetch(urlLoginMoodle, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' },
        }).then(resp => resp.json())
            .then(loginReturn => {

                // If token isn't null then import user from Moodle to MSA.
                // Otherwise if token == null means that user wasn't found.
                var token = loginReturn.token
                if (token) {

                    // Get user from Moodle by login (should be the user email)
                    fetch(urlGetUserMoodle(login), {
                        method: "GET",
                        headers: { 'Content-Type': 'application/json' },
                    }).then(resp => resp.json())
                        .then(listUserMoodle => {

                            let userMoodle = listUserMoodle[0]
                            let userData = {
                                email: userMoodle.email,
                                fullname: userMoodle.fullname,
                                firstname: userMoodle.firstname,
                                lastname: userMoodle.lastname,
                                username: userMoodle.username,
                                password: "password" // TODO Remove
                            }

                            Customuser.findOrCreate({ where: { email: login } }, userData, function (err, log) {
                                if (err) return;
                                cb(null, log)
                            });
                        });

                } else {

                    throw loginReturn.error;
                }

            }).catch(err => cb(err, login))
    }
};
