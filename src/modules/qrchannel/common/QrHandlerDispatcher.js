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

QrHandlerDispatcher.prototype.dispatch = function(message, user, res){
    var me = this, reply = '';
    if(!message.EventKey){
        me.defaultHandler && me.defaultHandler(message, user, res, null);
    }
    else{
        var index = message.EventKey.indexOf("_") + 1;
        var sceneId = message.EventKey.substring(index);
        QrChannelService.loadBySceneId(sceneId, function(err, qr){
            if(err){
                //TODO
                res.reply(reply);
                return;
            }
            if(qr){
                var key = me.genKey(qr.forever, qr.type);
                var handler = me.handlers[key];
                handler && handler.handle(message, user, res, qr);
            }
            else{
                me.nullHandler(message, user, res, null);
            }

        });
    }
};


module.exports = QrHandlerDispatcher;
