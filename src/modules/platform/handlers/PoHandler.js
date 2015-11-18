var co = require('co');
var wechatApi = require('../../wechat/common/api').api;

var PoEmitter = require('../emitters/PoEmitter');
var poEmitter = new PoEmitter();

require('./PoMsgHandler')(poEmitter);
var CommandRegistry = require('../../../framework/wechat/command-registry');
var registry = new CommandRegistry();
registry.addCommand('账户邀请二维码', require('./commands/sendTenantQrCodeCommand'));

module.exports = function(emitter){
    emitter.po(function(event, context){
        console.log('emit operator handler');
        co(function*(){
            var handler = null;
            try{
                context.user = yield context.getUser();
                handler = registry.extractCommandFromContext(context);
                if(handler){
                    handler();
                }else{
                    poEmitter.emit(context);
                }
            }catch(e){
                console.log('po handler err: ' + e);
            }
        })
    });
};