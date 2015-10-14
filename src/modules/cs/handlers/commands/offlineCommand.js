var cskv = require('../../kvs/CustomerService');
var cvsKv = require('../../../conversation/kvs/Conversation');
var cvsService = require('../../../conversation/services/ConversationService');
var wechatApi = require('../../../wechat/common/api').api;
module.exports = function(emitter){
    emitter.offline(function(context){
        var message = context.weixin;
        var user = null;
        context.getUser()
            .then(function(data){
                user = data;
                return cskv.remWcCSSetAsync(user.id);
            })
            .then(function(){
                return cvsKv.getCurrentCidAsync(user.id);
            })
            .then(function(cvsId){
                return cvsKv.loadByIdAsync(cvsId);
            })
            .then(function(cvs){
                if(cvs){
                    return cvsService.closeAsync(cvs);
                }
                return;
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