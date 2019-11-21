const course = require("./courseResolver");
const post = require("./postResolver");
const student = require("./studentResolver");
const enrollment = require("./enrollmentResolver");
const advice = require("./adviceResolver");
const device = require("./deviceResolver");
const message = require("./messageResolver");

module.exports = [course, post, student, enrollment, advice, device, message];