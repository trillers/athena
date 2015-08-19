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
    'tx':caseTaxiHandler,
    'co':caseCoffeeHandler
}
var handle = function(user, message){
    //placeCase:openid  {type: 2ct, payload:{xxx: 1, yyy: 2}, step:2}
    cskv.loadPlaceCaseAsync(user.wx_openid)
    .then(function(data){
        //different biz logic
        if(data){
            caseType[data.type](data, user, message);
            return Promise.reject(new Error('client Server is handling Case, so break fn Chain'));
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
                return Promise.reject(new Error('this is a cmd,so break fn Chain'));
            }
            return;
    })
    .then(function(){
        return cskv.loadCSSByIdAsync(user.wx_openid)
    })
    .then(function(data){
        if(data){
            var customer = data.csId;
            var msg = {
                from: user.wx_openid,
                to: customer,
                contentType: MsgContentType.names(message.MsgType),
                content: message.Content
            }
            co(function* (){
                yield MessageService.createAsync(msg);
                switch(message.MsgType){
                    case 'text':
                        co(function* (){
                            yield wechatApi.sendTextAsync(customer, message.Content);
                        })
                        break;
                    case 'image':
                        co(function* (){
                            yield wechatApi.sendImageAsync(customer, message.MediaId);
                        })
                        break;
                    case 'voice':
                        co(function* (){
                            yield wechatApi.sendVoiceAsync(customer, message.MediaId);
                        })
                        break;
                }
            })
        }else{
            return Promise.reject(new Error('the CS hasn,t establish conversation'));
        }
    })
    .catch(function(err){
        console.log(err);
    })
}

var handler = new CSHandler(UserRole.CustomerServer.value(), handle);

module.exports = handler;