'use strict';
var schedule = require('node-schedule');
var notif = require('../../server/services/notifications')

module.exports = function (app) {
  console.log("TASK SCHEDULER is running.")

  var j = schedule.scheduleJob('*/10 * * * * *', function () {
    checkNotifications();
  });

  const checkNotifications = () => {
    // Find all Message
    const Message = app.models.Message

    var StudentAdvice = app.models.StudentAdvice;

    Message.find({ include: 'student' }).then((listMessages) => {
      // Loop for each Message
      listMessages.forEach((message) => {
        const dataAtual = Date.now();

        const isSend = message.sentAt == null &&
          (message.scheduledFor != null &&
            dataAtual >= new Date(message.scheduledFor))

        if (isSend) {
          StudentAdvice.find({ where: { "studentId": message.studentId } }, function (err, advices) {
            advices.forEach(adv => notif.sendNotification(adv.token, message.student.fullname));
          });

          message.updateAttribute("sentAt", dataAtual)
        }

      });
    });
  }
 
  console.log("TASK SCHEDULER stopped.")
};