'use strict';

var async = require('async');

module.exports = function (app) {

    //create all models
    async.parallel({
      users: async.apply(createUsers),
      userGroups: async.apply(createUserGroups),

      
    }, function(err, results) {
      if (err) throw err;
      createMessages(results.users[0], function(err) {
        console.log('> Messages created sucessfully');
      });

      createUserAdvices(results.users[0], function(err) {
        console.log('> UserAdvices created sucessfully');
      });

      createEnrollment(results.users[0], results.userGroups[0], function(err) {
        console.log('> Enrollment created sucessfully');
      });

/*       createEnrollment(results.users[0], results.userGroups[1], function(err) {
        console.log('> Enrollment2 created sucessfully');
      });  */

    });

  function createUsers(cb) {
    app.dataSources.db.automigrate('User', function (err) {
      if (err) throw err;

      app.models.User.create([{
        email: 'viniciuspsilvas@gmail.com',
        password: '1234'
        //fullname: 'Vinicius Pereira Silva'

      }], cb);
    });
  };

  function createMessages(user, cb) {
    app.dataSources.pg.automigrate('Message', function (err) {
      if (err) throw err;

      app.models.Message.create([{
        title: 'Title Message 1',
        body: 'Body 1 description Body description Body description description',
        userId: user.id,
      }, {
        title: 'Title Message 2',
        body: 'Body 2 description Body description Body description description',
        userId: user.id,
      }, {
        title: 'Title Message 3',
        body: 'Body 3 description Body description Body description description',
        userId: user.id,
      }], cb);
    });
  };

  function createUserAdvices(user, cb) {
    app.dataSources.pg.automigrate('UserAdvice', function (err) {
      if (err) throw err;

      app.models.UserAdvice.create([{
        description: 'Samsung Galaxy S9+',
        token: 'ExponentPushToken[yApQ4KPHAZjJLD1UYzEv7u]',
        userId: user.id,

      }], cb);
    });
  };

  function createUserGroups(cb) {
    app.dataSources.pg.automigrate('UserGroup', function (err) {
      if (err) throw err;

      app.models.UserGroup.create([{
        name: 'CUA60315 - Advanced Diploma of Graphic Design',
        description: 'Advanced Diploma of Graphic Design',
      },
      {
        name: 'ICT40515 - Certificate IV in Programming',
        description: 'Certificate IV in Programming',
      },
      {
        name: 'ICT50615 - Diploma of Website Development',
        description: 'Diploma of Website Development',

      },
      {
        name: 'CUA60335 - Diploma of Project Management',
        description: 'Diploma of Project Management',

      }], cb);
    });
  };


  function createEnrollment(user, userGroup, cb) {

    app.dataSources.pg.automigrate('Enrollment', function (err) {
      if (err) throw err;

      app.models.Enrollment.create([{
        
        userId: user.id,
        userGroupId: userGroup.id,
        date: Date.now()

      }], cb);
    });
  };
};

