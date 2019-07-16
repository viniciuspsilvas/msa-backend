'use strict';

var notif = require('../../server/services/notifications')

module.exports = function (Message) {

    var app = require('../../server/server');

    Message.beforeRemote('create', function (ctx, _modelInstance_, next) {
        ctx.createdAt = Date.now
        next();
    });

    // remote method after hook
    Message.afterRemote('create', function (context, remoteMethodOutput, next) {
        let userId = context.result.userId;

        var StudentAdvice = app.models.StudentAdvice;

        // Find the advices of the user
        StudentAdvice.findOne({ where: { "studentId": userId } }, function (err, studentAdvice) {
            notif.sendNotification(studentAdvice.token, title);
        });

        next();
    });

    Message.sendMessageBatch = function (data, cb) {
        const { title, body, severity, receivers, datetime } = data;
        var StudentAdvice = app.models.StudentAdvice;

        if (receivers && receivers.length > 0) {
            receivers.forEach(function (student, index) {
                let message = {
                    "title": title,
                    "body": body,
                    "studentId": student.id,
                    "scheduledFor": datetime
                }
              
                // There is no datetime means the notification should be send now
                if (!datetime) {
                    // Find the advices of the user
                    StudentAdvice.find({ where: { "studentId": student.id } }, function (err, advices) {
                        advices.forEach(adv => notif.sendNotification(adv.token, title));
                    });

                    message.sentAt = Date.now();
                }

                Message.create(message)
            })
        }

        cb(null, 'Greetings... ' + data);
    }

    Message.remoteMethod('sendMessageBatch', {
        accepts: { arg: 'data', type: 'object' },
        returns: { arg: 'greeting', type: 'string' }
    });

};
