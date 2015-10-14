var cskv = require('../../kvs/CustomerService');
var wechatApi = require('../../../wechat/common/api').api;
module.exports = function(emitter){
    emitter.offline(function(context){
        var message = context.weixin;
        context.getUser()
            .then(function(user){
                return cskv.remWcCSSetAsync(user.id);
            })
            .then(function(){
                return cskv.delCSSByIdAsync(message.FromUserName);
            })
            .then(function(){
                wechatApi.sendText(message.FromUserName, '[系统]:您已下线', function(err, result){});
            })
            .catch(Error, function(e){
                console.log(e);
            })
    })
};