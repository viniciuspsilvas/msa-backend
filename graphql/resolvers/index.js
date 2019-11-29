const { requiresLogin } = include('server/security/authorizer');

const course = require("./courseResolver");
const post = require("./postResolver");
const student = require("./studentResolver");
const enrollment = require("./enrollmentResolver");
const advice = require("./adviceResolver");
const device = require("./deviceResolver");
const message = require("./messageResolver");
const config = require("./configResolver");
const user = require("./userResolver");


const protectedModules = [ enrollment, device, course]
const modules = [student,user, post, advice, config, message];

module.exports = modules.concat(protectedModules.map(m => requiresLogin(m)));