var QrChannelService = require('../services/QrChannelService');
var u = require('../../../app/util');
var logger = require('../../../app/logging').logger;


var QrHandlerDispatcher = function(){
    this.handlers = {};
    this.defaultHandler = null;
    this.nullHandler = null;
};

QrHandlerDispatcher.prototype.register = function(handler){
    var key = this.genKey(handler.forever, handler.type);
    this.handlers[key] = handler;
};

QrHandlerDispatcher.prototype.setDefaultHandler = function(handler){
    this.defaultHandler = handler;
};

QrHandlerDispatcher.prototype.setNullHandler = function(handler){
    this.nullHandler = handler;
};

QrHandlerDispatcher.prototype.genKey = function(forever, type){
    return (forever ? 'fv' : 'tm') + type;
};

QrHandlerDispatcher.prototype.dispatch = function* (message, user, ctx){
    console.log('start dispatch');
    var me = this, reply = '';
    if(!message.EventKey){
        me.defaultHandler && me.defaultHandler(message, user, ctx, null);
    }
    else{
        var index = message.EventKey.indexOf("_") + 1;
        var sceneId = message.EventKey.substring(index);
        try{
            var qr = yield QrChannelService.loadBySceneIdAsync(sceneId);
            if(qr){
                var key = me.genKey(qr.forever, qr.type);
                var handler = me.handlers[key];
                if(handler) {
                    yield handler.handle(message, user, ctx, qr);
                }
            }
            else{
                me.nullHandler(message, user, ctx, null);
            }
        }catch(err){
            ctx.body = reply;
            return;
        }
    }
};


module.exports = QrHandlerDispatcher;
