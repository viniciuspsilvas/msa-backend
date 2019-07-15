var server = require('../server');
var ds = server.dataSources.db;
var lbTables = ['User', 'AccessToken', 'ACL', 'RoleMapping', 'Role'];

ds.automigrate(lbTables, function (er) {
    if (er) throw er;
    console.log('Loopback tables [' + lbTables + '] created in ', ds.adapter.name);
    ds.disconnect();
});

var pg = server.dataSources.pg;
var pgTables = ['StudentGroup', 'Student', 'Enrollment', 'StudentAdvice', 'Message'];

pg.automigrate(pgTables, function (er2) {
    if (er2) throw er2;
    console.log('Loopback tables [' + pgTables + '] created in ', pg.adapter.name);
    ds.disconnect();
});