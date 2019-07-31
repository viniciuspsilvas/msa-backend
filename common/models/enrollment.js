'use strict';

module.exports = function (Enrollment) {

    /**
     * This method is resposable to remove the relationship between Student and StudentGroup
     * @param {number} idStudent 
     * @param {number} idGroup 
     * @param {Function(Error, string)} cb
     */

    Enrollment.deleteEnrollment = function (idStudent, idGroup, cb) {
        const filter = {
            studentGroupId: idGroup ,
            studentId: idStudent
        }
        Enrollment.destroyAll(filter, cb)
    };
};
