var onlineCommand = require('./onlineCommand');
var offlineCommand = require('./offlineCommand');
var callTaxiCommand = require('./callTaxiCommand');
var closeConvCommand = require('./closeConvCommand');
var bindUserCommand = require('./bindUserCommand')
var viewStateCommand = require('./viewStateCommand')
var commandSet = {
    viewState: 'vs',
    bindUser: 'bu',
    rollback: 'qu',
    quit: 'cc',
    online: 'ol',
    offline: 'of',
    callTaxi: 'ct'
}

var handlerSet = {
    'vs': viewStateCommand,
    'qu': "nothing",
    'bu': bindUserCommand,
    'ol': onlineCommand,
    'of': offlineCommand,
    'ct': callTaxiCommand,
    'cc': closeConvCommand
}

var Command = function(){
    this.commandSet = commandSet;
}

var pro = Command.prototype;
pro.commandType = function(message){
    if(message.MsgType == 'text'){
        if(message.Content.length >= 3 && message.Content[0] === ":" && handlerSet[message.Content.slice(1, 3)]){
            return message.Content.slice(1, 3);
        }
    }
    return null;
}

pro.getActionName = function(val){
    for(var prop in commandSet){
        if(commandSet[prop] === val){
            return prop;
        }
    }
}

pro.commandHandler = function(command){
    return handlerSet[command];
}

var command = new Command();
module.exports = command;