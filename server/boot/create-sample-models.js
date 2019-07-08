'use strict';

var async = require('async');

module.exports = function (app) {

  //create all models
  async.parallel({
    users: async.apply(createStudents),
    userGroups: async.apply(createUserGroups),

  }, function (err, results) {
    if (err) throw err;
    createMessages(results.users[0], function (err) {
      console.log('> Messages created sucessfully');
    });

    createRoles(results.users[0], function (err) {
      console.log('> Roles created sucessfully');
    });

    createUserAdvices(results.users[0], function (err) {
      console.log('> StudentAdvices created sucessfully');
    });

    createEnrollment(results.users[0], results.userGroups[0], function (err) {
      console.log('> Enrollment created sucessfully');
    });

    /*       createEnrollment(results.users[0], results.userGroups[1], function(err) {
            console.log('> Enrollment2 created sucessfully');
          });  */

  });
  
  
  function createStudents(cb) {
    app.dataSources.pg.automigrate('Student', function (err) {
      if (err) throw err;

      app.models.Student.create([
      
        {
          email: 'viniciuspsilvas@gmail.com',
          lastname: 'Silva',
          firtsname: 'Vinicius',
          username: 'viniciuspsilvas',
          password: 'Password123!',
          fullname: 'Vinicius Pereira Silva',
          phone: '0451472462'
        },
         {
          email: 'glaucomp@hotmail.com',
          fullname: 'Glauco Martins Pereira',
          firtsname: 'Glauco',
          lastname: 'Pereira',
          username: 'glaucomp',
          password: 'Password123!',
          phone: '0451472462'
        }, {
          email: 'lifemagalhaes@gmail.com',
          lastname: 'Marganelli',
          firtsname: 'Guilherme',
          username: 'lifemagalhaes',
          password: 'Password123!',
          fullname: 'Guilherme Magalhaes Marganelli',
          phone: '0451472462'
        }, {
          email: 'gustavobarbeta@gmail.com',
          lastname: 'Barbeta',
          firtsname: 'Gustavo',
          username: 'gustavobarbeta',
          password: 'Password123!',
          fullname: 'Gustavo Aguiar Barbeta',
          phone: '0451472462'
        }, {
          email: 'isa.miyashiro@yahoo.com.br',
          lastname: 'Miyashiro',
          firtsname: 'Isabela',
          username: 'isa.miyashiro',
          password: 'Password123!',
          fullname: 'Isabela Carvalho Miyashiro',
          phone: '0451472462'
        }
        , {
          email: 'blair.roberts@axcelerate.com.au',
          fullname: 'Blair Roberts',
          firtsname: 'Blair',
          lastname: 'Roberts',
          username: 'blair.roberts',
          password: 'Password123!',
          phone: '0451472462'
        }, {
          email: 'brunobressanspaulonci@gmail.com',
          fullname: 'Bruno Bressan Spaulonci',
          firtsname: 'Bruno',
          lastname: 'Spaulonci',
          username: 'brunobressanspaulonci',
          password: 'Password123!',
          phone: '0451472462'
        }, {
          email: 'camilaztt@hotmail.com',
          fullname: 'Camila Ziliotto De Oliviera',
          firtsname: 'Camila',
          lastname: 'Oliviera',
          username: 'camilaztt',
          password: 'Password123!',
          phone: '0451472462'
        }, {
          email: 'Ca_depaula@hotmail.com',
          fullname: 'Camila MARZOCHI DE PAULA',
          firtsname: 'Camila',
          lastname: 'PAULA',
          username: 'Ca_depaula',
          password: 'Password123!',
          phone: '0451472462'
        }, {
          email: 'Capc77@gmail.com',
          fullname: 'Camilo Andres Perez Claro',
          firtsname: 'Camila',
          lastname: 'PAULA',
          username: 'Capc77',
          password: 'Password123!',
          phone: '0451472462'
        } 

      ], cb);
    });
  };

  function createRoles(user, cb) {
    var RoleMapping = app.models.RoleMapping;

    app.dataSources.db.automigrate('Role', function (err) {
      if (err) throw err;

      //create the admin role
      app.models.Role.create({
        name: 'admin'
      }, function (err, role) {
        if (err) cb(err);

        //make bob an admin
        role.principals.create({
          principalType: RoleMapping.USER,
          principalId: user.id
        }, function (err, principal) {
          cb(err);
          console.log('Created principal:', principal);
        });
      });

    });
  };

  function createMessages(user, cb) {
    app.dataSources.pg.automigrate('Message', function (err) {
      if (err) throw err;


  /*     const msgs = [{
        title: 'Title Message 1',
        body: 'Body 1 description Body description Body description description',
        studentId: user.id,
      }, {
        title: 'Title Message 2',
        body: 'Body 2 description Body description Body description description',
        studentId: user.id,
      }, {
        title: 'Title Message 3',
        body: 'Body 3 description Body description Body description description',
        studentId: user.id,
      }] */

      const msgs = [];

      app.models.Message.create(msgs, cb);
    });
  };

  function createUserAdvices(user, cb) {
    app.dataSources.pg.automigrate('StudentAdvice', function (err) {
      if (err) throw err;

      app.models.StudentAdvice.create([{
        description: 'Android SDK built for x86',
        token: 'ExponentPushToken[0K3RRhG1fVHGqBdlWfXSyN]',
        studentId: user.id,

      }], cb); 

      app.models.StudentAdvice.create([{
        description: 'Samsung Galaxy S9+',
        token: 'ExponentPushToken[yApQ4KPHAZjJLD1UYzEv7u]',
        studentId: 2,

      }], cb); 
    });
  };

  function createUserGroups(cb) {
    app.dataSources.pg.automigrate('StudentGroup', function (err) {
      if (err) throw err;

      app.models.StudentGroup.create([{
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

