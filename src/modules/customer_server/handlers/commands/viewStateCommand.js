var cskv = require('../../kvs/CustomerServer');
var wechatApi = require('../../../wechat/common/api').api;
var common = require('./commonCommand');
var co = require('co');
var csState = require('../../../common/models/TypeRegistry').item('CSState')
module.exports = function(user, message, callback){
    //response [系统]:您的当前状态为-在线-会话中
    console.log('in vs---------------------------')
    co(function* (){
        var stat = yield cskv.loadCSStatusByCSOpenIdAsync(user.wx_openid);
        yield wechatApi.sendTextAsync(user.wx_openid, '[系统]:您的当前状态为'+csState.values(user.status));
        callback(null, null)
    })
};