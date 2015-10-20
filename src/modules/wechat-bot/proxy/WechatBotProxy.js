var EventEmitter = require('events').EventEmitter;
var util = require('util');
var subClient = require('../../../app/redis-client')('sub');
var pubClient = require('../../../app/redis-client')('pub');

var events = {
    /*
     * {
     *   FromUserName: (bid)
     *   FromUserNickname: nickname in case of no bid
     *   ToUserName: botid
     *   MsgId: UUID (String)
     *   CreateTime: millisecond/1000 (String)
     *   MsgType: 'text/image/voice'
     *   Content: (String for text message)
     *   MediaId: (String for voice and image message)
     * }
     */
    'message': true,

    /*
     * {
     *   botid
     *   bid:
     *   nickname:
     *   headIconUrl:
     *   place:
     * }
     */
    'profile': true,

    /*
     * {
     *   botid
     *   bid:
     *   nickname:
     * }
     */
    'contact-added': true,

    /*
     * {
     *   botid
     *   media_id:
     * }
     */
    'need-login': true
};

var channels = {
    /*
     * {
     *     ToUserName: bid
     *     FromUserName: botid (bucketid:openid)
     *     MsgType: 'text'
     *     Content: to-be-sent text String
     * }
     */
    messageSend: 'sbot:message-send',

    /*
     * {
     *     botid: (String)
     * }
     */
    botStartRequest: 'sbot:start',

    /*
     * {
     *     botid: (String)
     * }
     */
    botStopRequest: 'sbot:stop',

    /*
     * {
     *     botid: (String)
     *     bid: (String)
     * }
     */
    profileRequest: 'sbot:profile-request',

    profileResponse: 'sbot:profile',
    messageReceived: 'sbot:message',
    contactAdded: 'sbot:contact-added',
    needLogin: 'sbot:need-login'
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
    this.emit(event, msg.err, msg.data);
};

WechatBotProxy.prototype.start = function(botid){
    this.pubClient.publish(channels.botStartRequest, JSON.stringify({botid: botid}));
};

WechatBotProxy.prototype.stop = function(botid){
    this.pubClient.publish(channels.botStopRequest, JSON.stringify({botid: botid}));
};

WechatBotProxy.prototype.send = function(msg){
    this.pubClient.publish(channels.messageSend, JSON.stringify(msg));
};

WechatBotProxy.prototype.requestProfile = function(botid, bid){
    this.pubClient.publish(channels.profileRequest, JSON.stringify({botid: botid, bid: bid}));
};

module.exports = WechatBotProxy;







