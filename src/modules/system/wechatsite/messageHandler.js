var roleEmitter = require('./roleEmitter');
var CommandRegistry = require('../../../framework/wechat/command-registry');
var registry = new CommandRegistry();

module.exports = function(emitter){
    emitter.message(function(event, context){
        console.log(context.weixin);
        var handler = registry.extractCommandFromContext(context);
        if(handler){
            handler();
        }
        else{
            roleEmitter.emit(context);
        }
    });
};