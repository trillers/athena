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
require('./commands/onlineCommand')(csEmitter);
require('./commands/offlineCommand')(csEmitter);
require('./commands/closeCvsCommand')(csEmitter);
require('./CsMsgHandler')(csEmitter);
var handle = function(context){
    var message = context.weixin;
    var stt = null;
    context.getUser()
    .then(function(cacheUser){
        context.user = cacheUser;
        return cskv.loadCSStatusByCSOpenIdAsync(message.FromUserName);
    })
    .then(function(st){
        context.user.status = st || 'off';  //TODO temp
        csEmitter.emit(context);
    })
    .catch(Error, function(e){
        console.log("------------------");
        console.log(e);
    })
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

module.exports = function(emitter){
    emitter.cs(function(event, context){
        console.log('emit customer service handler');
        handle(context);
    });
};