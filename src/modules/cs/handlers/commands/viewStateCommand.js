var cskv = require('../../kvs/CustomerService');
var wechatApi = require('../../../wechat/common/api').api;
var common = require('./commonCommand');
var co = require('co');
var csState = require('../../../common/models/TypeRegistry').item('CSState')
module.exports = function(emitter){
    emitter.status(function(context){
        var message = context.weixin;
        var user = context.user;
        //response [系统]:您的当前状态为-在线-会话中
        co(function* (){
            var stat = yield cskv.loadCSStatusByCSOpenIdAsync(message.FromUserName);
            yield wechatApi.sendTextAsync(message.FromUserName, '[系统]:您的当前状态为'+csState.values(user.status));
        })
    })
};