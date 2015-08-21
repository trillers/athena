var Promise = require('bluebird')
function validateUserBind(user, callback){

}
module.exports.validateUserBindAsync = Promise.promisify(validateUserBind);