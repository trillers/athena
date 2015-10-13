var EventEmitter = require('events').EventEmitter;
var cmdWorkflow = require('./common/FSM').getWf('cmdWorkflow');
var wechatApi = require('../wechat/common/api').api;
var cskv = require('./kvs/CustomerService');
var Promise = require('bluebird');
var cmdType = {
    '上线': 'online',
    '下线': 'offline',
    '关闭': 'closeCvs'
}
function CsEmitter(){
    this.emitter = new EventEmitter();
}
CsEmitter.prototype.emit = function(context){
    var content = context.weixin.Content.trim();
    var message = context.weixin;
    var user = context.user;
    var me = this;
    if(content in cmdType){
        var type = cmdType[content],
            promise = new Promise(function(resolve, reject){resolve()});
        switch(type){
            case 'online':
                promise = cskv.saveCSStatusByCSOpenIdAsync(message.FromUserName, 'ol');
                break;
            case 'offline':
                promise = cskv.saveCSStatusByCSOpenIdAsync(message.FromUserName, 'off');
                break;
        }
        promise.then(function(){
            return cskv.resetCSStatusTTLByCSOpenIdAsync(message.FromUserName);
        })
            .then(function(){
                return me.emitter.emit(cmdType[content], context);
            });
        //if(cmdWorkflow.canInWild(cmdType[content], stt)){
        //    this.emitter.emit(cmdType[content], context);
        //    var status = cmdWorkflow.transition(cmdType[content], stt);
        //    cskv.saveCSStatusByCSOpenIdAsync(user.wx_openid, status)
        //        .then(function(){
        //            return cskv.resetCSStatusTTLByCSOpenIdAsync(user.wx_openid);
        //        });
        //    return;
        //}else{
        //    wechatApi.sendText(user.wx_openid, '[系统]:当前状态不能执行该操作', function(err, result){});
        //    return;
        //}
    }else{
        this.emitter.emit('message', 'message', context);
    }
};
CsEmitter.prototype.message = function(handler){ this.emitter.on('message', handler); };
CsEmitter.prototype.online = function(handler){ this.emitter.on('online', handler); };
CsEmitter.prototype.offline = function(handler){ this.emitter.on('offline', handler); };
CsEmitter.prototype.closeCvs = function(handler){ this.emitter.on('closeCvs', handler); };
module.exports = CsEmitter;