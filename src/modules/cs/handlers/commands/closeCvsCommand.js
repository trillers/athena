var wechatApi = require('../../../wechat/common/api').api;
var cvsService = require('../../../conversation/services/ConversationService');
var cvsKv = require('../../../conversation/kvs/Conversation');
var cskv = require('../../kvs/CustomerService');

module.exports = function(context){
    var user = context.user;
    var message = context.weixin;
    cskv.resetCSStatusTTLByCSOpenIdAsync(message.FromUserName)
    .then(function(){
        cvsKv.getCurrentCidAsync(user.id)
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
        return cskv.pushWcCSSetAsync(user.id);
    })
    .then(function(){
        return wechatApi.sendTextAsync(message.FromUserName, '[系统]: 已关闭当前会话');
    })
    .catch(Error, function(e){
        console.log(e)
    })
};