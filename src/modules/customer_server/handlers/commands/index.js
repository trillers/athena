var onlineCommand = require('./onlineCommand');
var offlineCommand = require('./offlineCommand');
var callCarCommand = require('./callCarCommand');
var closeConvCommand = require('./closeConvCommand');
var bindUserCommand = require('./bindUserCommand')
var viewStateCommand = require('./viewStateCommand')
var commandSet = {
    viewState: 'state',
    bindUser: 'bind',
    rollback: 'back',
    quit: 'close',
    online: 'on',
    offline: 'off',
    callCar: 'car'
}

var handlerSet = {
    'state': viewStateCommand,
    'back': "nothing",
    'bind': bindUserCommand,
    'on': onlineCommand,
    'off': offlineCommand,
    'car': callCarCommand,
    'close': closeConvCommand
}

var Command = function(){
    this.commandSet = commandSet;
}

var pro = Command.prototype;
pro.commandType = function(message){
    if(message.MsgType == 'text'){
        if(message.Content.length >= 3 && message.Content[0] === ":" && handlerSet[message.Content.slice(1)]){
            return message.Content.slice(1);
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