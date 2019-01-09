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
            notif.sendNotification(studentAdvice.token);

        });

        next();
    });


    Message.sendMessageBatch = function(data, cb) {
        var StudentAdvice = app.models.StudentAdvice;

        data.receivers.forEach(function(student,index) { 
            let message = {
                "title": data.title,
                "body": data.body,
                "severity": data.severity,
                "studentId": student.id
            }

            Message.create(message)


            // Find the advices of the user
            StudentAdvice.findOne({ where: { "studentId": student.id } }, function (err, studentAdvice) {
                notif.sendNotification(studentAdvice.token, student.fullname);
    
            });
         })


        cb(null, 'Greetings... ' + data);
      }
  
      Message.remoteMethod('sendMessageBatch', {
            accepts: {arg: 'data', type: 'object'},
            returns: {arg: 'greeting', type: 'string'}
      });

};
