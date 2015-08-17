var CSHandler = require('../common/CSHandler');
var UserRole = require('../../common/models/TypeRegistry').item('UserRole');
var cskv = require('../kvs/CustomerServer');
var onlineCommand = require('./commands/onlineCommand');
var offlineCommand = require('./commands/offlineCommand');
var callTaxiCommand = require('./commands/callTaxiCommand');
var closeConvCommand = require('./commands/closeConvCommand');
var caseTaxiHandler = require('./cases/caseTaxiHandler');
var caseCoffeeHandler = require('./cases/caseCoffeeHandler');
var co = require('co');
var commandSet = {
    'ol': onlineCommand,
    'of': offlineCommand,
    'ct': callTaxiCommand,
    'cc': closeConvCommand
}
var caseType = {
    'tx':caseTaxiHandler,
    'co':caseCoffeeHandler
}
var handle = function(user, message, res){
    //placeCase:openid  {type: 2ct, payload:{xxx: 1, yyy: 2}, step:2}
    co(function* (){
        return yield cskv.placeCaseAsync(user.wx_openid)
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
        if(_commandOrMsg(message)){
            var executeFn = _commandOrMsg(message);
            executeFn(options, function(err, data){

            });
        }
    })
    .then(function(){
        return cskv.loadCSSByIdAsync(user.wx_openid)
    })
    .then(function(data){
        if(data){

        }else{
            return Promise.reject(new Error('the CS hasn,t establish conversation'));
        }
    })
    .catch(function(err){

    })
}
function _commandOrMsg(message){
    return message.content.length >= 3 && message.content[0] === ":" && commandSet[':' + message.content.slice(1, 3)];
}

var handler = new CSHandler(UserRole.CustomerServer.value(), handle());

module.exports = handler;