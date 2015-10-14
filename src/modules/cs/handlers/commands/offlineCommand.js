var cskv = require('../../kvs/CustomerService');
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
                return cvsService.filterAsync({
                    conditions:{
                        csId: user.id
                    }
                })
            })
            .then(function(cvsArr){
                if(cvsArr.length>0){
                    return cvsService.closeAsync(cvsArr[0]);
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