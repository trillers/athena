var cskv = require('../../kvs/CustomerService');
var wechatApi = require('../../../wechat/common/api').api;
var ConversationKv = require('../../../conversation/kvs/Conversation');
module.exports = function(emitter){
    emitter.online(function(context){
        var user = context.user;
        var message = context.weixin;
        cskv.resetCSStatusTTLByCSOpenIdAsync(message.FromUserName)
            .then(function(){
                return cskv.pushWcCSSetAsync(user.id);
            })
            .then(function(){
                return;
                //return require('../../../conversation/common/ConversationQueue').emit('csOnline', {csId: user.wx_openid});
            })
            .then(function(){
                wechatApi.sendText(message.FromUserName, '[系统]:您已上线', function(err, result){});
            });

    })
};