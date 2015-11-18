var MessageService = require('../../message/services/MessageService');
var UserRole = require('../../common/models/TypeRegistry').item('UserRole');
var MsgContentType = require('../../common/models/TypeRegistry').item('MsgContent');
var cskv = require('../kvs/CustomerService');
var co = require('co');
var command = require('./commands');
var wechatApi = require('../../wechat/common/api').api;

var OperatorEmitter = require('../emitters/OperatorEmitter');
var OperatorEmitter = new OperatorEmitter();

require('./CsMsgHandler')(csEmitter);
var CommandRegistry = require('../../../framework/wechat/command-registry');
var registry = new CommandRegistry();
registry.addCommand('上线', require('./commands/onlineCommand'));

module.exports = function(emitter){
    emitter.cs(function(event, context){
        console.log('emit customer service handler');
        co(function*(){
            var message = context.weixin;
            var stt = null;
            var handler = null;
            try{
                context.user = yield context.getUser();
                stt = yield cskv.loadCSStatusByCSOpenIdAsync(message.FromUserName);
                context.user.status = stt || 'off';  //TODO temp
                handler = registry.extractCommandFromContext(context);
                if(handler){
                    handler();
                }else{
                    csEmitter.emit(context);
                }
            }catch(e){
                console.log(e);
            }
        })
    });
};