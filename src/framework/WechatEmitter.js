var EventEmitter = require('events').EventEmitter;
var WechatEmitter = function(){
    this.emitter = new EventEmitter();
};

var EVENT_TYPES = {
    subscribe:  'subscribe'
    ,unsubscribe:  'unsubscribe'
    ,LOCATION:  'LOCATION'
    ,SCAN:  'SCAN'
    ,CLICK:  'CLICK'
    ,VIEW:  'VIEW'
};

var MSG_TYPES = {
    text:  'text'
    ,image:  'image'
    ,voice:  'voice'
    ,video:  'video'
    ,shortvideo:  'shortvideo'
    ,location:  'location'
    ,link:  'link'
};

/**
 * event type includes: subscribe unsubscribe LOCATION SCAN CLICK VIEW
 * msg type includes: text image voice video shortvideo location link
 * other type incudes: message (for all message), unknown
 * @param context
 */
WechatEmitter.prototype.emit = function(context){
    var msg = context.weixin;

    /*
     * emit event for general messages here
     */
    this.emitter.emit('message', 'message', context);

    var msgType = msg.MsgType;
    var eventType = msg.Event;

    /*
     * emit event for specific types of messages here
     */
    if(msgType == 'event'){
        /**
         * event type includes: subscribe unsubscribe LOCATION SCAN CLICK VIEW
         */
        if(EVENT_TYPES[eventType]){
            this.emitter.emit(eventType, eventType, context);
        }
        else{
            this.emitter.emit('unknown', 'unknown', context);
        }
    }else{
        /**
         * msg type includes: text image voice video shortvideo location link
         */
        if(MSG_TYPES[msgType]){
            this.emitter.emit(msgType, msgType, context);
        }
        else{
            this.emitter.emit('unknown', 'unknown', context);
        }
    }
};

/**
 * custom message: message
 * register a message listener for any type of messages
 * @param listener
 */
WechatEmitter.prototype.message = function(listener){ this.emitter.on('message', listener); };

/**
 * unknow message: unknown
 * register a message listener for unknown type of messages
 * @param listener
 */
WechatEmitter.prototype.unknown = function(listener){ this.emitter.on('unknown', listener); };

/**
 * msg type includes: subscribe unsubscribe LOCATION SCAN CLICK VIEW
 */
WechatEmitter.prototype.subscribe = function(listener){ this.emitter.on('subscribe', listener); };
WechatEmitter.prototype.unsubscribe = function(listener){ this.emitter.on('unsubscribe', listener); };
WechatEmitter.prototype.LOCATION = function(listener){ this.emitter.on('LOCATION', listener); };
WechatEmitter.prototype.SCAN = function(listener){ this.emitter.on('SCAN', listener); };
WechatEmitter.prototype.CLICK = function(listener){ this.emitter.on('CLICK', listener); };
WechatEmitter.prototype.VIEW = function(listener){ this.emitter.on('VIEW', listener); };

/**
 * msg type includes: text image voice video shortvideo location link
 */
WechatEmitter.prototype.text = function(listener){ this.emitter.on('text', listener); };
WechatEmitter.prototype.image = function(listener){ this.emitter.on('image', listener); };
WechatEmitter.prototype.voice = function(listener){ this.emitter.on('voice', listener); };
WechatEmitter.prototype.video = function(listener){ this.emitter.on('video', listener); };
WechatEmitter.prototype.shortvideo = function(listener){ this.emitter.on('shortvideo', listener); };
WechatEmitter.prototype.location = function(listener){ this.emitter.on('location', listener); };
WechatEmitter.prototype.link = function(listener){ this.emitter.on('link', listener); };

module.exports = WechatEmitter;