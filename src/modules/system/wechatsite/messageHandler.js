var roleMsgDispatcher = require('./roleMsgDispatcher');
var logger = require('../../../app/logging').logger;
var CommandRegistry = require('../../../framework/wechat/command-registry');
var registry = new CommandRegistry();
registry.addCommand('账户邀请二维码', require('../../platform/main/commands/sendTenantQrCodeCommand'));

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