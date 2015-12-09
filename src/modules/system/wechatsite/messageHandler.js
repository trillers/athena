var roleMsgDispatcher = require('./roleMsgDispatcher');
var logger = require('../../../app/logging').logger;
var CommandRegistry = require('../../../framework/wechat/command-registry');
var registry = new CommandRegistry();

registry.addCommand('成为平台运营专员', require('../../platform/main/commands/becomePlatformOperationCommand'));
registry.addCommand('成为平台管理员', require('../../platform/main/commands/becomePlatformAdminCommand'));


module.exports = function(emitter){
    emitter.message(function(event, context){
        logger.debug(context.weixin);
        var handler = registry.extractCommandFromContext(context);
        if(handler){
            handler();
        }
        else{
            roleMsgDispatcher.emit(context);
        }
    });
};