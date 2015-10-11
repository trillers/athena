var wechatApi = require('../../../wechat/common/api').api;
var cvsService = require('../../../conversation/services/ConversationService');
var cskv = require('../../kvs/CustomerService');

module.exports = function(emitter){
    //require('../../../conversation/common/ConversationQueue').emit('taskFinish', {csId: user.wx_openid});
    emitter.closeCvs(function(context){
        var user = context.user;
        cvsService.filterAsync({
            conditions:{
                csId: user.id
            }
        })
        .then(function(cvsArr){
            return cvsService.closeAsync(cvsArr[0]);
        })
        .then(function(){
            return cskv.pushWcCSSetAsync(user.id);
        })
        .then(function(){
            return wechatApi.sendTextAsync(user.wx_openid, '已关闭当前会话');
        })
        .catch(Error, function(e){
            console.log(e)
        })
    })
};