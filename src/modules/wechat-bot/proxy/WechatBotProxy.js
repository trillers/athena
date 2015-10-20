var EventEmitter = require('events').EventEmitter;
var util = require('util');
var subClient = require('../../../app/redis-client')('sub');
var pubClient = require('../../../app/redis-client')('pub');

var events = {
    'message': true,
    'profile': true,
    'contact-added': true,
    'need-login': true
};

var channels = {
    messageSend: 'sbot:message-send',
    messageReceived: 'sbot:message',
    profileRequest: 'sbot:profile-request',
    profileResponse: 'sbot:profile',
    contactAdded: 'sbot:contact-added',
    needLogin: 'sbot:need-login',
    botStartRequest: 'sbot:start',
    botStopRequest: 'sbot:stop'
};

var WechatBotProxy = function(pub, sub){
    EventEmitter.call(this);
    this.pubClient = pub || pubClient;
    this.subClient = sub || subClient;

    this.subClient.subscribe('sbot:' + channels.messageReceived);
    this.subClient.subscribe('sbot:' + channels.profileResponse);
    this.subClient.subscribe('sbot:' + channels.contactAdded);
    this.subClient.subscribe('sbot:' + channels.needLogin);
    this.subClient.on('message', this._handleMessage.bind(this));
};

util.inherits(WechatBotProxy, EventEmitter);

WechatBotProxy.prototype._handleMessage = function(channel, msg){
    var msg = JSON.parse(msg);
    var event = channel.split(':')[1];
    events[event] && this.emit(event, msg.err, msg.data);
};

WechatBotProxy.prototype.start = function(botid){
    this.pubClient.publish(channels.botStartRequest, botid);
};

WechatBotProxy.prototype.stop = function(botid){
    this.pubClient.publish(channels.botStopRequest, botid);
};

WechatBotProxy.prototype.send = function(msg){
    this.pubClient.publish(channels.messageSend, JSON.stringify(msg));
};

WechatBotProxy.prototype.requestProfile = function(botid, bid){
    this.pubClient.publish(channels.profileRequest, JSON.stringify({botid: botid, bid: bid}));
};

module.exports = WechatBotProxy;







