var csQrCodeHandler = require('../../qrchannel/handlers/CSQrCodeHandler');
var OperationStateCommand = require('./commands/OperationStateCommand');
module.exports = function(emitter){
    emitter.admin(function(event, context){
        var msg = context.weixin;
        var user = context.user;
        console.log('this is admin message');
        console.log(msg);
        if(msg.MsgType == 'text') {
            csQrCodeHandler(msg.Content, user);
            OperationStateCommand(msg.Content, user);
        }
    });
};