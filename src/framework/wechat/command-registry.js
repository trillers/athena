var CommandRegistry = function(){
    this.commands = {};
};

CommandRegistry.prototype.addCommand = function(cmdPattern, cmdHandler){
    this.commands[cmdPattern] = cmdHandler;
};

CommandRegistry.prototype.evaluate = function(message){
    var params = Array.prototype.slice.call(arguments, 1);
    var cmdPattern = message && typeof message == 'string' && message.trim() || null;
    var handler = cmdPattern && this.commands[cmdPattern];
    if(handler){
        return function(){
            handler.apply(null, params);
        };
    }
    else {
        return null;
    }
};

module.exports = CommandRegistry;