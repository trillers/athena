var onlineCommand = require('./onlineCommand');
var offlineCommand = require('./offlineCommand');
var callCarCommand = require('./callCarCommand');
var closeConvCommand = require('./closeConvCommand');
var bindUserCommand = require('./bindUserCommand');
var viewStateCommand = require('./viewStateCommand');
var modifyFromCommand = require('./modifyFromCommand');
var modifyToCommand = require('./modifyToCommand');
var submitCommand = require('./submitCommand');
var cancelCommand = require('./cancelCommand');
var rollbackCommand = require('./rollbackCommand');
var quitCommand = require('./quitCommand');

var commandSet = {
    viewState: 'state',
    bindUser: 'bind',
    rollback: 'back',
    close: 'close',
    quit: 'quit',
    online: 'on',
    offline: 'off',
    callCar: 'car',
    modifyFrom: 'from',
    modifyTo: 'to',
    submitOrder: 'submit',
    cancelOrder: 'cancel'
}

var handlerSet = {
    'state': viewStateCommand,
    'back': rollbackCommand,
    'bind': bindUserCommand,
    'on': onlineCommand,
    'off': offlineCommand,
    'car': callCarCommand,
    'close': closeConvCommand,
    'modifyFrom': modifyFromCommand,
    'modifyTo': modifyToCommand,
    'submit': submitCommand,
    'cancel': cancelCommand,
    'quit': quitCommand
}

var Command = function(){
    this.commandSet = commandSet;
}

var pro = Command.prototype;
pro.getCommand = function(message){
    if(message.MsgType == 'text'){
        var msgArr = message.Content.split(' ').filter(function(item){
            return item !== '';
        });
        if(msgArr[0].length >= 3 && msgArr[0][0] === ":" && handlerSet[msgArr[0].slice(1)]){
            var command = {
                action: msgArr[0].slice(1),
                arg: msgArr.length > 1 ? msgArr[1] : null
            }
            return command;
        }
        return null;
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