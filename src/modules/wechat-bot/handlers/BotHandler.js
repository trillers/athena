var CommandRegistry = require('../../../framework/wechat/command-registry');
var registry = new CommandRegistry();
registry.addCommand('运营状态', require('./commands/OperationStateCommand'));
registry.addCommand('客服二维码', require('../../qrchannel/handlers/CSQrCodeHandler'));
registry.addCommand('创建老用户', require('./commands/CreateOldUserCommand'));

module.exports = function(emitter){
    emitter.admin(function(event, context){
        console.log('this is admin message');
        var handler = registry.extractCommandFromContext(context);
        if(handler){
            handler();
        }else{
            //TODO
        }
    });
};