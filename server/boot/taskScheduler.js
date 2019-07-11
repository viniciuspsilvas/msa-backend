'use strict';


var format = require('date-format');
const FD = 'dd/MM/yyyy'

const taskAttendance = (task) => { console.log('Executing taskAttendance.', task.idTask) }
const taskAcademicProgress = (task) => { console.log('Executing taskAcademicProgress.', task.idTask) }
const taskSubmissionDueDate = (task) => { console.log('Executing taskSubmissionDueDate.', task.idTask) }

const TASKS = [
  { id: 1, name: 'ATTENDANCE', func: taskAttendance },
  { id: 2, name: 'ACADEMIC PROGRESS', func: taskAcademicProgress },
  { id: 3, name: 'SUBMISSION DUE DATE', func: taskSubmissionDueDate }
]

const getListTasks = (app) => {

  var dataAtual = new Date();
  dataAtual.setMinutes(0)
  dataAtual.setSeconds(0)
  dataAtual.setMilliseconds(0)

  // Find all tasks
  const TaskScheduler = app.models.TaskScheduler

  TaskScheduler.find().then((listTasks) => {

    // Loop for each task
    listTasks.forEach((taskSched) => {

      //Runs the task if it passes the test.
      const TASK = TASKS.find(t => t.id == taskSched.idTask);

      if (TASK &&
        taskSched.isActive &&
        (!taskSched.lastExec || format(FD, dataAtual) != format(FD, taskSched.lastExec)) &&  // Checks if it has not yet been executed today.
        dataAtual.getDay() == taskSched.weekDay && // Check date and time
        dataAtual.getHours() == taskSched.time
      ) {

        TASK.func(taskSched);
        taskSched.updateAttributes({ lastExec: dataAtual })
      }

    });
  });
}

module.exports = function (app) {
  app.dataSources.pg.automigrate('TaskScheduler', function (err) {
    if (err) throw err;

    app.models.TaskScheduler.create([
      { idTask: 1, weekDay: 3, time: 7, name: 'ATTENDANCE ', message: 'ATTENDANCE Message' },
      { idTask: 2, weekDay: 3, time: 21, name: 'ACADEMIC PROGRESS ', message: 'ACADEMIC PROGRESS Message' },
      { idTask: 3, weekDay: 3, time: 21, name: 'SUBMISSION DUE DATE ', message: 'SUBMISSION DUE DATE Message' }
    ])
  });

  console.log("TASK SCHEDULER is running.")

  var schedule = require('node-schedule');
  

  // COMENTADO POIS NAO SERA IMPLEMENTADO TANKS NESSE MOMENTO
//  var j = schedule.scheduleJob('*/10 * * * * *', function () {
//    getListTasks(app);
//  });

  console.log("TASK SCHEDULER stopped.")
};