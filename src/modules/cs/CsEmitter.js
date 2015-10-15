var EventEmitter = require('events').EventEmitter;
var cmdWorkflow = require('./common/FSM').getWf('cmdWorkflow');
var wechatApi = require('../wechat/common/api').api;
var cskv = require('./kvs/CustomerService');
var Promise = require('bluebird');
function CsEmitter(){
    this.emitter = new EventEmitter();
}
CsEmitter.prototype.emit = function(context){
    var content = context.weixin.Content;
    var message = context.weixin;
    var user = context.user;
    var me = this;
    this.emitter.emit('message', 'message', context);
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
};
CsEmitter.prototype.message = function(handler){ this.emitter.on('message', handler); };
module.exports = CsEmitter;