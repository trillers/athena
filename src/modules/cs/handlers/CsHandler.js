var MessageService = require('../../message/services/MessageService');
var UserRole = require('../../common/models/TypeRegistry').item('UserRole');
var MsgContentType = require('../../common/models/TypeRegistry').item('MsgContent');
var cskv = require('../kvs/CustomerService');
var caseCarHandler = require('./cases/caseCarHandler');
var caseCoffeeHandler = require('./cases/caseCoffeeHandler');
var co = require('co');
var command = require('./commands');
var wechatApi = require('../../wechat/common/api').api;
var caseType = {
    'car':caseCarHandler,
    'co':caseCoffeeHandler
};
var cmdWorkflow = require('../common/FSM').getWf('cmdWorkflow');
var CsEmitter = require('../CsEmitter');
var csEmitter = new CsEmitter();

require('./CsMsgHandler')(csEmitter);
var CommandRegistry = require('../../../framework/wechat/command-registry');
var registry = new CommandRegistry();
registry.addCommand('上线', require('./commands/onlineCommand'));
registry.addCommand('下线', require('./commands/offlineCommand'));
registry.addCommand('关闭', require('./commands/closeCvsCommand'));

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
//var handle = function(user, message){
//    var stt;
//    cskv.loadCSStatusByCSOpenIdAsync(user.wx_openid)
//        .then(function(st){
//            stt = st || 'off';
//            user.status = stt;
//            return cskv.loadPlaceCaseAsync(user.wx_openid)
//        })
//        .then(function(data){
//            if(data){
//                caseType[data['payload'].type](data, user, message);
//                return Promise.reject(new Error('isCase'));
//            }
//            return;
//        })
//        .then(function(){
//            var com = command.getCommand(message);
//            if(com) {
//                if(cmdWorkflow.canInWild(command.getActionName(com.action), stt)){
//                    var executeFn = command.commandHandler(com.action);
//                    executeFn(user, com.arg, function(err, data){
//                        console.log(com.action + 'command finish');
//                        if(!err){
//                            var status = cmdWorkflow.transition(command.getActionName(com.action), stt)
//                            cskv.saveCSStatusByCSOpenIdAsync(user.wx_openid, status)
//                                .then(function(){
//                                    return cskv.resetCSStatusTTLByCSOpenIdAsync(user.wx_openid);
//                                });
//                        }
//                    });
//                    return Promise.reject(new Error('isCmd'));
//                }else{
//                    wechatApi.sendTextAsync(user.wx_openid, '[系统]:当前状态不能执行该操作');
//                    return Promise.reject(new Error('illegalOperation'));
//                }
//            }
//        })
//        .then(function(){
//            return cskv.loadCSSByIdAsync(user.wx_openid)
//        })
//        .then(function(data){
//            if(data){
//                var customer = data.initiator;
//                var msg = {
//                    from: user.wx_openid,
//                    to: customer,
//                    contentType: MsgContentType.names(message.MsgType),
//                    content: message.Content || message.MediaId,
//                    channel: data._id
//                }
//                co(function* (){
//                    yield MessageService.createAsync(msg);
//                    switch(message.MsgType){
//                        case 'text':
//                            yield wechatApi.sendTextAsync(customer, message.Content);
//                            break;
//                        case 'image':
//                            yield wechatApi.sendImageAsync(customer, message.MediaId);
//                            break;
//                        case 'voice':
//                            yield wechatApi.sendVoiceAsync(customer, message.MediaId);
//                            break;
//                    }
//                })
//            }else{
//                return wechatApi.sendTextAsync(user.wx_openid, '[系统]:您还没有建立会话');
//            }
//        })
//        .then(function(){
//            return cskv.resetCSStatusTTLByCSOpenIdAsync(user.wx_openid);
//        })
//        .catch(function(err){
//            if(err && err.message != 'isCase' && err.message != 'isCmd' &&err.message != 'illegalOperation') console.log(err);
//        })
//}