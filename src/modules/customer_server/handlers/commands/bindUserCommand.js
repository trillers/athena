var cskv = require('../../kvs/CustomerServer');
var wechatApi = require('../../../wechat/common/api').api;
var common = require('./commonCommand');
var co = require('co');
module.exports = function(user, message, callback){
    //check binded or not
    //push a tag
    //sendText User has already bind [系统]：用户已完成绑定
    co(function* (){
        var conversation = yield cskv.loadCSSByIdAsync(user.wx_openid);
        if(!conversation){
            yield wechatApi.sendTextAsync(user.wx_openid, '[系统]:当前没有会话');
            return callback(null, null);
        }
        var bindOrNot = yield common.validateUserBindAsync(conversation.initiator);
        if(bindOrNot){
            yield wechatApi.sendTextAsync(user.wx_openid, '[系统]:用户已绑定');
            return callback(null, null);
        }
        var res = '请先绑定您的手机，我们才能联系你哦\n<a href="http://ci.www.wenode.org/p/userbind">点击绑定手机</a>'
        yield wechatApi.sendTextAsync(conversation.initiator, res);
        yield wechatApi.sendTextAsync(user.wx_openid, '[系统]:绑定请求已发出');
        return callback(null, null);
    })
};