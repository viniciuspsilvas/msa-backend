const { AuthenticationError } = require('apollo-server');
var { isFunction, isObject, mapValues } = require('lodash');

const requiresRole = role => resolver => {
    if (isFunction(resolver)) {
        return (parent, args, context, info) => {
           // if (context.user && (!role || context.user.role === role)) { //  TODO use when implement ROLEs
            if (context.token) {
                return resolver(parent, args, context, info)
            } else {
                throw new AuthenticationError('Not authorized')
            }
        }
    } else if (isObject(resolver)) {
        return mapValues(resolver, requiresRole(role))
    } else {
        throw new Error('Resolver has to be Object or Function')
    }
}

const membersOnly = requiresRole('MEMBER')
const adminsOnly = requiresRole('ADMIN')
const requiresLogin = requiresRole(null)

module.exports = {
    requiresRole,
    membersOnly,
    adminsOnly,
    requiresLogin
}