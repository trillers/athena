var RoleEmitter = require('../RoleEmitter');
var roleEmitter = new RoleEmitter();

module.exports = function(emitter){
    emitter.message(function(event, context){
        roleEmitter.emit(context);
        var msg = context.weixin;
    });
};