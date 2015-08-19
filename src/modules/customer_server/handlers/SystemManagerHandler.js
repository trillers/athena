var CSHandler = require('../common/CSHandler');
var UserRole = require('../../common/models/TypeRegistry').item('UserRole');


var handle = function(user, message, ctx){

}

var handler = new CSHandler(UserRole.SystemManager.value(), handle);

module.exports = handler;