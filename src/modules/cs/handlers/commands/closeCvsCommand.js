var wechatApi = require('../../../wechat/common/api').api;
var cvsService = require('../../../conversation/services/ConversationService');
var cskv = require('../../kvs/CustomerService');

module.exports = function(emitter){
    //require('../../../conversation/common/ConversationQueue').emit('taskFinish', {csId: user.wx_openid});
    emitter.closeCvs(function(context){
        console.log("$$$$$$$$$$$$$$$")
        var user = context.user;
        var message = context.weixin;
        cvsService.filterAsync({
            conditions:{
                csId: user.id
            }
        })
        .then(function(cvsArr){
            if(cvsArr.length > 0){
                return cvsService.closeAsync(cvsArr[0]);
            }
            return;
        })
        .then(function(){
            return cskv.pushWcCSSetAsync(user.id);
        })
        .then(function(){
            return wechatApi.sendTextAsync(message.FromUserName, '已关闭当前会话');
        })
        .catch(Error, function(e){
            console.log(e)
        })
    })
};