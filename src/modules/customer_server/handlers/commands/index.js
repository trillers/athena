var onlineCommand = require('./onlineCommand');
var offlineCommand = require('./offlineCommand');
var callTaxiCommand = require('./callTaxiCommand');
var closeConvCommand = require('./closeConvCommand');

var commandSet = {
    quit: 'cc',
    online: 'ol',
    offline: 'of',
    callTaxi: 'ct'
}

var handlerSet = {
    'ol': onlineCommand,
    'of': offlineCommand,
    'ct': callTaxiCommand,
    'cc': closeConvCommand
}

var Command = function(){
    this.commandSet = commandSet;
}

var pro = Command.prototype;
pro.isCommand = function(message){
    if(message.content.length >= 3 && message.Content[0] === ":" && handlerSet[message.Content.slice(1, 3)]){
        return message.Content.slice(1, 3);
    }
    return null;
}

pro.commandHandler = function(command){
    return handlerSet[command];
}

var command = new Command();
module.exports = command;