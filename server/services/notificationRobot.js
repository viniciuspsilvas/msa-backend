'use strict';
var schedule = require('node-schedule');
var notif = require('./notifications')

const Message = require('../../graphql/models/message');

module.exports = async () => {
    console.log("TASK SCHEDULER is running.", new Date())

    var rule = new schedule.RecurrenceRule();
    rule.second = 10;

    var j = schedule.scheduleJob(rule, function () {
        checkNotifications();
    });

    const checkNotifications = async () => {

        const listMessages = await Message.find({ $and: [{ scheduledFor: { $ne: null } }, { sentAt: { $eq: null } }] })
            .populate({
                path: 'student',
                populate: {
                    path: 'device',
                }
            })

        // Loop for each Message
        listMessages.forEach((message) => {
            const dataActual = Date.now();
            const isSend = message.sentAt == null &&
                (message.scheduledFor != null &&
                    dataActual >= new Date(message.scheduledFor))

            if (isSend) {
                console.log("Sending message => ", message._id)
                notif.sendNotification(message.student.device.token, message.title);

                message.sentAt = dataActual;
                message.save();
            }
        });
    }
};