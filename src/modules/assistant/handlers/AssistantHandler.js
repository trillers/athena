var RoleEmitter = require('../RoleEmitter');
var roleEmitter = new RoleEmitter();
require('../../cs/handlers/CsHandler')(roleEmitter);
require('../../customer/handlers/CustomerHandler')(roleEmitter);

module.exports = function(emitter){
    emitter.message(function(event, context){
        roleEmitter.emit(context);
    });
};