var roleEmitter = require('../roleEmitter');
var CommandRegistry = require('../../../framework/wechat/command-registry');
var registry = new CommandRegistry();
registry.addCommand('删除当前用户', require('./commands/deleteUserCommand'));
registry.addCommand('成为客户', require('./commands/setRoleToCustomerCommand'));
registry.addCommand('成为客服', require('./commands/setRoleToCsCommand'));
registry.addCommand('成为管理员', require('./commands/setRoleToAdminCommand'));
registry.addCommand('成为微信助手', require('./commands/setRoleToBotCommand'));
registry.addCommand('锁定微信助手', require('./commands/lockBotCommand'));
registry.addCommand('状态', require('./commands/showMyStateCommand'));

module.exports = function(emitter){
    emitter.message(function(event, context){
        console.log(context.weixin);
        var handler = registry.extractCommandFromContext(context);
        if(handler){
            handler();
        }
        else{
            roleEmitter.emit(context);
        }
    });
};