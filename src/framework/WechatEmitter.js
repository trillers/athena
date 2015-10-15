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

WechatEmitter.prototype.bindEvent = function(type, site) {
    var me = this;
    site.on(type, function(message){
        var wxsession = site._ensureSession(message.FromUserName);
        var context = {weixin: message, wxsession: wxsession};
        if(me.decorator) me.decorator.decorate(context);

        me.emitter.emit('raw', 'raw', context);
        me.emitter.emit('event', 'event', context);
        me.emitter.emit(type, type, context);
    });
};

WechatEmitter.prototype.bindEventQr = function(type, site) {
    var me = this;
    site.on(type, function(message){
        var wxsession = site._ensureSession(message.FromUserName);
        var context = {weixin: message, wxsession: wxsession};
        if(me.decorator) me.decorator.decorate(context);

        me.emitter.emit('raw', 'raw', context);
        me.emitter.emit('event', 'event', context);
        me.emitter.emit('qr', 'qr', context);
        me.emitter.emit(type, type, context);
    });
};

WechatEmitter.prototype.bindMessage = function(type, site) {
    var me = this;
    site.on(type, function(message){
        var wxsession = site._ensureSession(message.FromUserName);
        var context = {weixin: message, wxsession: wxsession};
        if(me.decorator) me.decorator.decorate(context);

        me.emitter.emit('raw', 'raw', context);
        me.emitter.emit('message', 'message', context);
        me.emitter.emit(type, type, context);
    });
};

WechatEmitter.prototype.bindSite = function(site) {
    /*
     * bind and trigger event type message
     */
    this.bindEvent('subscribe', site);
    this.bindEvent('SCAN', site);
    this.bindEventQr('qrsubscribe', site);
    this.bindEventQr('qrSCAN', site);
    this.bindEvent('unsubscribe', site);
    this.bindEvent('LOCATION', site);
    this.bindEvent('CLICK', site);
    this.bindEvent('VIEW', site);
    this.bindEvent('enter', site);
    this.bindEvent('exit', site);

    /*
     * bind and trigger non-event type message
     */
    this.bindMessage('text', site);
    this.bindMessage('image', site);
    this.bindMessage('voice', site);
    this.bindMessage('video', site);
    this.bindMessage('shortvideo', site);
    this.bindMessage('location', site);
    this.bindMessage('link', site);
};


/**
 * event type includes: subscribe unsubscribe LOCATION SCAN CLICK VIEW
 * msg type includes: text image voice video shortvideo location link
 * other type incudes: raw (for all message), event (for all event),
 * message (for all pure message), unknown.
 * @param context
 */
WechatEmitter.prototype.relay = function(context){
    var msg = context.weixin;
    if(this.decorator) this.decorator.decorate(context);

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
         * custom event type includes: qr qrsubscribe qrSCAN
         */
        if(EVENT_TYPES[eventType]){
            if('subscribe' == eventType && msg.EventKey){
                var index = msg.EventKey.indexOf("_") + 1;
                msg.SceneId = msg.EventKey.substring(index);
                this.emitter.emit('qr', 'qr', context);
                var customEventType = 'qrsubscribe';
                this.emitter.emit(customEventType, customEventType, context);
            }
            else if('SCAN' == eventType && msg.EventKey) {
                msg.SceneId = msg.EventKey;
                this.emitter.emit('qr', 'qr', context);
                var customEventType = 'qrSCAN';
                this.emitter.emit(customEventType, customEventType, context);
            }
            else{
                this.emitter.emit(eventType, eventType, context);
            }
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
 * EVENT type of event
 * msg type includes: subscribe unsubscribe LOCATION SCAN CLICK VIEW
 */
WechatEmitter.prototype.subscribe = function(handler){ this.emitter.on('subscribe', handler); };
WechatEmitter.prototype.unsubscribe = function(handler){ this.emitter.on('unsubscribe', handler); };
WechatEmitter.prototype.LOCATION = function(handler){ this.emitter.on('LOCATION', handler); };
WechatEmitter.prototype.SCAN = function(handler){ this.emitter.on('SCAN', handler); };
WechatEmitter.prototype.CLICK = function(handler){ this.emitter.on('CLICK', handler); };
WechatEmitter.prototype.VIEW = function(handler){ this.emitter.on('VIEW', handler); };

/**
 * CUSTOM EVENT type of event
 * msg type includes: qr, qrSubscribe, qrSCAN
 */
WechatEmitter.prototype.qr = function(handler){ this.emitter.on('qr', handler); };
WechatEmitter.prototype.qrsubscribe = function(handler){ this.emitter.on('qrsubscribe', handler); };
WechatEmitter.prototype.qrSCAN = function(handler){ this.emitter.on('qrSCAN', handler); };

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

WechatEmitter.prototype.setContextDecorator = function(decorator){ this.decorator = decorator;};

module.exports = WechatEmitter;