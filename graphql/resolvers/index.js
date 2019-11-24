const course = require("./courseResolver");
const post = require("./postResolver");
const student = require("./studentResolver");
const enrollment = require("./enrollmentResolver");
const advice = require("./adviceResolver");
const device = require("./deviceResolver");
const message = require("./messageResolver");
const config = require("./configResolver");
const user = require("./userResolver");

module.exports = [course, post, user, student, enrollment, advice, device, message, config];