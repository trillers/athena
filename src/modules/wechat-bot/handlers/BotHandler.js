var CommandRegistry = require('../../../framework/wechat/command-registry');
var registry = new CommandRegistry();
registry.addCommand('启动助手', require('./commands/startBotCommand'));
registry.addCommand('停止助手', require('./commands/stopBotCommand'));

module.exports = function(emitter){
    emitter.bot(function(event, context){
        console.log('this is bot message');
        var handler = registry.extractCommandFromContext(context);
        if(handler){
            handler();
        }else{
            context.weixin.Content && (context.body = context.weixin.Content); //echo text message
        }
    });
};