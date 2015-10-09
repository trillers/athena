var cskv = require('../../kvs/CustomerService');
var wechatApi = require('../../../wechat/common/api').api;
var common = require('./commonCommand');
var co = require('co');
var csState = require('../../../common/models/TypeRegistry').item('CSState')
module.exports = function(emitter){
    emitter.status(function(context){
        var user = context.user;
        var message = context.weixin;
        //response [系统]:您的当前状态为-在线-会话中
        co(function* (){
            var stat = yield cskv.loadCSStatusByCSOpenIdAsync(user.wx_openid);
            yield wechatApi.sendTextAsync(user.wx_openid, '[系统]:您的当前状态为'+csState.values(user.status));
        })
    })
};