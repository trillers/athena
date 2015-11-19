var WechatOperationService = require('../../wechat/services/WechatOperationService');

module.exports = function(emitter){
    emitter.raw(function(event, context){
        var message = context.weixin;
        WechatOperationService.logActionAsync(message);
    });
};