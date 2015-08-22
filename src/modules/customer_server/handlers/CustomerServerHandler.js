var CSHandler = require('../common/CSHandler');
var MessageService = require('../../message/services/MessageService');
var UserRole = require('../../common/models/TypeRegistry').item('UserRole');
var MsgContentType = require('../../common/models/TypeRegistry').item('MsgContent');
var cskv = require('../kvs/CustomerServer');
var caseTaxiHandler = require('./cases/caseTaxiHandler');
var caseCoffeeHandler = require('./cases/caseCoffeeHandler');
var co = require('co');
var command = require('./commands');
var wechatApi = require('../../wechat/common/api').api;
var caseType = {
    'ct':caseTaxiHandler,
    'co':caseCoffeeHandler
}
var cmdWorkflow = require('../common/FSM').getWf('cmdWorkflow');
var handle = function(user, message){
    var stt;
    cskv.loadCSStatusByCSOpenIdAsync(user.wx_openid)
    .then(function(st){
        stt = st || 'off';
        user.status = stt;
        return cskv.loadPlaceCaseAsync(user.wx_openid)
    })
    .then(function(data){
        if(data){
            caseType[data.type](data, user, message);
            return Promise.reject(new Error('isCase'));
        }
        return;
    })
    .then(function(){
        var commandType = command.commandType(message);
        if(commandType) {
            var executeFn = command.commandHandler(commandType);
            if(cmdWorkflow.canInWild(command.getActionName(commandType), stt)){
                executeFn(user, message, function(err, data){
                    console.log(commandType + 'command finish');
                    if(!err){
                        var status = cmdWorkflow.transition(command.getActionName(commandType), stt)
                        cskv.saveCSStatusByCSOpenId(user.wx_openid, status, function(){})
                    }
                });
                return Promise.reject(new Error('isCmd'));
            }else{
                wechatApi.sendTextAsync(user.wx_openid, '[系统]:当前状态不能执行该操作');
                return Promise.reject(new Error('illegalOperation'));
            }
        }
        return;
    })
    .then(function(){
        return cskv.loadCSSByIdAsync(user.wx_openid)
    })
    .then(function(data){
        if(data){
            var customer = data.initiator;
            var msg = {
                from: user.wx_openid,
                to: customer,
                contentType: MsgContentType.names(message.MsgType),
                content: message.Content || message.MediaId,
                channel: data._id
            }
            co(function* (){
                yield MessageService.createAsync(msg);
                switch(message.MsgType){
                    case 'text':
                        yield wechatApi.sendTextAsync(customer, message.Content);
                        break;
                    case 'image':
                        yield wechatApi.sendImageAsync(customer, message.MediaId);
                        break;
                    case 'voice':
                        yield wechatApi.sendVoiceAsync(customer, message.MediaId);
                        break;
                }
            })
        }else{
            return wechatApi.sendTextAsync(user.wx_openid, '[系统]:您还没有建立会话');
        }
    })
    .then(function(){
            return cskv.resetCSStatusTTLByCSOpenIdAsync(user.wx_openid);
        })
    .catch(function(err){
        if(err && err.message != 'isCase' && err.message != 'isCmd' &&err.message != 'illegalOperation') console.log(err);
    })
}

var handler = new CSHandler(UserRole.CustomerServer.value(), handle);

module.exports = handler;