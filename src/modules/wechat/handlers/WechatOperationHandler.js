var WechatOperationService = require('../services/WechatOperationService');
var userKvs = require('../../user/kvs/User');

module.exports = function(emitter){
    emitter.raw(function(event, context){
        var message = context.weixin;
        var openid = message.FromUserName;
        userKvs.saveSessionByOpenid(openid, function(err, result){
           //TODO
        });
        WechatOperationService.logActionAsync(message);
    });
};