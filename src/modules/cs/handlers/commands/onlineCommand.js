var cskv = require('../../kvs/CustomerService');
var wechatApi = require('../../../wechat/common/api').api;
var ConversationKv = require('../../../conversation/kvs/Conversation');
module.exports = function(context){
    var user = context.user;
    var message = context.weixin;
    cskv.saveCSStatusByCSOpenIdAsync(message.FromUserName, 'ol')
        .then(function(){
            return cskv.pushWcCSSetAsync(user.id);
        })
        .then(function(){
            wechatApi.sendText(message.FromUserName, '[系统]: 您已上线', function(err, result){});
        });
    //.then(function() {
    //    return cskv.resetCSStatusTTLByCSOpenIdAsync(message.FromUserName)
    //})
};