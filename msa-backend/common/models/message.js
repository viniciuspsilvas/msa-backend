'use strict';

var notif = require('../../server/services/notifications')

module.exports = function (Message) {
    var app = require('../../server/server');

    Message.afterRemote('create', function (context, modelInstance, next) {

        var UserAdvice = app.models.UserAdvice;

        let userId = context.result.userId;
        UserAdvice.findOne({ where: { "userId": userId } }, function (err, userAdvice) {
            notif.sendNotification(userAdvice.token);
            next();
        });
    });

};
