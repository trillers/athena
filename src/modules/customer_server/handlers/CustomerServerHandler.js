var CSHandler = require('../common/CSHandler');
var MessageService = require('../../message/services/MessageService');
var UserRole = require('../../common/models/TypeRegistry').item('UserRole');
var MsgContentType = require('../../common/models/TypeRegistry').item('MsgContent');
var cskv = require('../kvs/CustomerServer');
var caseTaxiHandler = require('./cases/caseTaxiHandler');
var caseCoffeeHandler = require('./cases/caseCoffeeHandler');
var co = require('co');
var command = require('./commands');

var caseType = {
    'tx':caseTaxiHandler,
    'co':caseCoffeeHandler
}
var handle = function(user, message, res){
    //placeCase:openid  {type: 2ct, payload:{xxx: 1, yyy: 2}, step:2}
    co(function* (){
        return yield cskv.loadPlaceCaseAsync(user.wx_openid)
    })
    .then(function(data){
        //different biz logic
        if(data){
            caseType[data.type](data, user, message, res);
            return Promise.reject(new Error('client Server is handling Case, so break fn Chain'));
        }
        return;
    })
    .then(function(){
            var commandType = command.commandType(message);
            if(commandType) {
                var executeFn = command.commandHandler(commandType);
                executeFn(user, message, res, function(err, data){

                });
            }
            return;
    })
    .then(function(){
        return cskv.loadCSSByIdAsync(user.wx_openid)
    })
    .then(function(data){
        if(data){
            var customer = data.openId;
            var msg = {
                from: user.wx_openid,
                to: customer,
                contentType: MsgContentType.names(message.MsgType),
                content: message.content
            }
            co(function* (){
                yield MessageService.createAsync(msg);

            })
        }else{
            res.reply('当前无会话');
            return Promise.reject(new Error('the CS hasn,t establish conversation'));
        }
    })
    .catch(function(err){
        console.log(err);
    })
}

var handler = new CSHandler(UserRole.CustomerServer.value(), handle());

module.exports = handler;