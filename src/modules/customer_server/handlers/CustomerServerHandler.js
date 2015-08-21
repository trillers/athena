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
var handle = function(user, message){
    cskv.loadPlaceCaseAsync(user.wx_openid)
    .then(function(data){
        if(data){
            caseType[data.type](data, user, message);
            return Promise.resolve();
        }
        return;
    })
    .then(function(){
        var commandType = command.commandType(message);
        if(commandType) {
            var executeFn = command.commandHandler(commandType);
            executeFn(user, message, function(err, data){
                console.log(commandType + 'command finish');
            });
            return Promise.resolve();
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
            return wechatApi.sendTextAsync(user.wx_openid, '您还没有建立会话');
        }
    })
    .catch(function(err){
        console.log(err);
    })
}

var handler = new CSHandler(UserRole.CustomerServer.value(), handle);

module.exports = handler;