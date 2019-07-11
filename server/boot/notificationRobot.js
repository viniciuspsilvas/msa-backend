'use strict';
var schedule = require('node-schedule');
var notif = require('../../server/services/notifications')

module.exports = function (app) {
  console.log("TASK SCHEDULER is running.")

  var j = schedule.scheduleJob('*/10 * * * * *', function () {
    checkNotifications();
  });

  const checkNotifications = () => {
    console.log("Verificando notificacoes.")

    // Find all Message
    const Message = app.models.Message

    var StudentAdvice = app.models.StudentAdvice;

    Message.find({ include: 'user' }).then((listMessages) => {
      // Loop for each Message
      listMessages.forEach((message) => {
        const dataAtual = Date.now();

        const isSend = message.sentAt == null &&
          (message.scheduledFor != null &&
            dataAtual >= new Date(message.scheduledFor))

        if (isSend) {
          console.log("### message send", message)

          StudentAdvice.find({ where: { "studentId": message.studentId } }, function (err, advices) {
            advices.forEach(adv => notif.sendNotification(adv.token, message.user.fullname));
          });

          message.updateAttribute("sentAt", dataAtual)
        }

      });
    });
  }
 
  console.log("TASK SCHEDULER stopped.")
};