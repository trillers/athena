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
 * other type incudes: raw (for all message), event (for all event),
 * message (for all pure message), unknown.
 * @param context
 */
WechatEmitter.prototype.emit = function(context){
    var msg = context.weixin;

    /*
     * emit event for general messages here
     */
    this.emitter.emit('raw', 'raw', context);

    var msgType = msg.MsgType;
    var eventType = msg.Event;

    /*
     * emit event for specific types of messages here
     */
    if(msgType == 'event'){
        this.emitter.emit('event', 'event', context);
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
        this.emitter.emit('message', 'message', context);
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
 * custom message: raw
 * register a message handler for any type of messages
 * @param handler
 */
WechatEmitter.prototype.raw = function(handler){ this.emitter.on('raw', handler); };

/**
 * custom message: event
 * register a message handler for event type of messages
 * @param handler
 */
WechatEmitter.prototype.event = function(handler){ this.emitter.on('event', handler); };

/**
 * custom message: message
 * register a message handler for pure message type of messages
 * @param handler
 */
WechatEmitter.prototype.message = function(handler){ this.emitter.on('message', handler); };

/**
 * unknow message: unknown
 * register a message handler for unknown type of messages
 * @param handler
 */
WechatEmitter.prototype.unknown = function(handler){ this.emitter.on('unknown', handler); };

/**
 * msg type includes: subscribe unsubscribe LOCATION SCAN CLICK VIEW
 */
WechatEmitter.prototype.subscribe = function(handler){ this.emitter.on('subscribe', handler); };
WechatEmitter.prototype.unsubscribe = function(handler){ this.emitter.on('unsubscribe', handler); };
WechatEmitter.prototype.LOCATION = function(handler){ this.emitter.on('LOCATION', handler); };
WechatEmitter.prototype.SCAN = function(handler){ this.emitter.on('SCAN', handler); };
WechatEmitter.prototype.CLICK = function(handler){ this.emitter.on('CLICK', handler); };
WechatEmitter.prototype.VIEW = function(handler){ this.emitter.on('VIEW', handler); };

/**
 * msg type includes: text image voice video shortvideo location link
 */
WechatEmitter.prototype.text = function(handler){ this.emitter.on('text', handler); };
WechatEmitter.prototype.image = function(handler){ this.emitter.on('image', handler); };
WechatEmitter.prototype.voice = function(handler){ this.emitter.on('voice', handler); };
WechatEmitter.prototype.video = function(handler){ this.emitter.on('video', handler); };
WechatEmitter.prototype.shortvideo = function(handler){ this.emitter.on('shortvideo', handler); };
WechatEmitter.prototype.location = function(handler){ this.emitter.on('location', handler); };
WechatEmitter.prototype.link = function(handler){ this.emitter.on('link', handler); };

module.exports = WechatEmitter;