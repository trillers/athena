var CSHandler = require('../common/CSHandler');
var UserRole = require('../../common/models/TypeRegistry').item('UserRole');


var handle = function(user, message, res){

}

var handler = new CSHandler(UserRole.RegularUser.value(), handle());

module.exports = handler;


