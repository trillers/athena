var cskv = require('../../kvs/CustomerService');
var wechatApi = require('../../../wechat/common/api').api;
module.exports = function(emitter){
    emitter.online = function(context){
        var user = context.user;
        var message = context.weixin;
        cskv.remWcCSSetAsync(user.wx_openid)
            .then(function(){
                return cskv.delCSSByIdAsync(user.wx_openid);
            })
            .then(function(){
                wechatApi.sendText(user.wx_openid, '您已下线', function(err, result){});
            });
    }
};