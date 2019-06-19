'use strict';

module.exports = function (app, cb) {
  /*
   * The `app` object provides access to a variety of LoopBack resources such as
   * models (e.g. `app.models.YourModelName`) or data sources (e.g.
   * `app.datasources.YourDataSource`). See
   * https://loopback.io/doc/en/lb3/Working-with-LoopBack-objects.html
   * for more info.
   */

  var User = app.models.User;
  User.create(
    {
      email: 'admin@mindroom.edu.au',
      password: 'Password123!',
      lastname: 'Innovation',
      firtsname: 'Mindroom',
      username: 'admin',
      fullname: 'Mindroom Innovation',
      phone: '0451472462'
    }
    , function(err, userInstance) {
    console.log("created sucessfully: "+userInstance);
  });

  process.nextTick(cb); // Remove if you pass `cb` to an async function yourself
};
