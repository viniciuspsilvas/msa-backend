const root = require("./root");
const course = require("./courseTypeDef");
const student = require("./studentTypeDef");
const enrollment = require("./enrollmentTypeDef");
const advice = require("./adviceTypeDef");
const device = require("./deviceTypeDef");
const message = require("./messageTypeDef");
const config = require("./configTypeDef");
const user = require("./userTypeDef");

module.exports = [root, user, course, student, enrollment, advice, device, message, config];