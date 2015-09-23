var csQrCodeHandler = require('../../modules/qrchannel/handlers/CSQrCodeHandler');

module.exports = function(emitter){
    emitter.admin(function(event, context){
        var msg = context.weixin;
        var user = context.user;
        console.log('this is admin message');
        console.log(msg);
        csQrCodeHandler(msg.Content, user);
    });
};