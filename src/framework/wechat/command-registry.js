var CommandRegistry = function(){
    this.commands = {};
};

CommandRegistry.prototype.addCommand = function(cmdPattern, cmdHandler){
    this.commands[cmdPattern] = cmdHandler;
};

CommandRegistry.prototype.extractCommand = function(text){
    var cmdPattern = text && typeof text == 'string' && text.trim();
    var handler = cmdPattern && this.commands[cmdPattern];
    if(handler){
        var params = Array.prototype.slice.call(arguments, 1);
        return function(){
            handler.apply(null, params);
        };
    }
    else {
        return null;
    }
};

CommandRegistry.prototype.extractCommandFromMessage = function(msg){
    var cmdPattern = 'text' == msg.MsgType && typeof msg.Content == 'string' && msg.Content.trim();
    var handler = cmdPattern && this.commands[cmdPattern];
    if(handler){
        var params = Array.prototype.slice.call(arguments, 0);
        return function(){
            handler.apply(null, params);
        };
    }
    else {
        return null;
    }
};

CommandRegistry.prototype.extractCommandFromContext = function(context){
    var msg = context.weixin;
    var cmdPattern = null;
    if('text' == msg.MsgType && typeof msg.Content == 'string'){
        cmdPattern = msg.Content.trim();
    }
    else if('voice' == msg.MsgType && typeof msg.Recognition == 'string'){
        cmdPattern = msg.Recognition.slice(0, msg.Recognition.indexOf('！'));
    }
    else{
        //non-command message
    }

    var handler = cmdPattern && this.commands[cmdPattern];
    if(handler){
        var params = Array.prototype.slice.call(arguments, 0);
        return function(){
            handler.apply(null, params);
        };
    }
    else {
        return null;
    }
};

module.exports = CommandRegistry;