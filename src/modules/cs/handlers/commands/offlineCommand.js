var cskv = require('../../kvs/CustomerService');
var wechatApi = require('../../../wechat/common/api').api;
module.exports = function(emitter){
    emitter.offline(function(context){
        var message = context.weixin;
        cskv.remWcCSSetAsync(message.FromUserName)
            .then(function(){
                return cskv.delCSSByIdAsync(message.FromUserName);
            })
            .then(function(){
                wechatApi.sendText(message.FromUserName, '[系统]:您已下线', function(err, result){});
            });
    })
};