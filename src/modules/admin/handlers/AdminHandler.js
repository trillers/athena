var csQrCodeHandler = require('../../qrchannel/handlers/CSQrCodeHandler');
var OperationStateCommand = require('./commands/OperationStateCommand');
module.exports = function(emitter){
    emitter.admin(function(event, context){
        var msg = context.weixin;
        var userOpenid = context.weixin.FromUserName;
        console.log('this is admin message');
        console.log(msg);
        if(msg.MsgType == 'text') {
            csQrCodeHandler(msg.Content, userOpenid);
            OperationStateCommand(msg.Content, userOpenid);
        }
    });
};