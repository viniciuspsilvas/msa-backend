'use strict';

const app = require('../../server/server');
const notif = require('../../server/services/notifications')

const PUSHER_APP_ID = 829464;
const PUSHER_APP_KEY = "2d68feae7baa98ec16b8";
const PUSHER_APP_SECRET = "577d33a2ae3e46f450f0"
const CLUSTER = "ap1"
const MSA_MESSAGE_CHANNEL = "MSA-MESSAGE-CHANNEL"
 
module.exports = function (Message) {

    Message.sendMessageBatch = function (data, cb) {
        const { title, body, receivers, datetime } = data;
        var StudentAdvice = app.models.StudentAdvice;

        if (receivers && receivers.length > 0) {
            receivers.forEach(function (student, index) {
                let message = {
                    "title": title,
                    "body": body,
                    "studentId": student.id,
                    "scheduledFor": datetime,
                    "createdAt": Date.now
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

                var Pusher = require('pusher');
                var channels_client = new Pusher({
                    appId: PUSHER_APP_ID,
                    key: PUSHER_APP_KEY,
                    secret: PUSHER_APP_SECRET,
                    cluster: CLUSTER,
                    encrypted: true
                });

                channels_client.trigger(MSA_MESSAGE_CHANNEL, `msa.message.student.${student.id}`, {
                    "message": "New message to student=" + student.id
                });
            })
        }

        cb(null, 'Greetings... ' + data);
    }

    Message.remoteMethod('sendMessageBatch', {
        accepts: { arg: 'data', type: 'object' },
        returns: { arg: 'greeting', type: 'string' }
    });

};
