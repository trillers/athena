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
     *   headimgid:
     *   place:
     *   sex: 1: male, 2: female 0: unknown
     * }
     */
    'profile': true,

    /*
     * {
     *   botid
     *   list: [
     *      {
     *          name:
     *          username:
     *      },
     *      ...
     *   ]
     * }
     */
    'group-list': true,

    /*
     * {
     *   botid
     *   bid:
     *   nickname:
     *   headimgid:
     *   place
     *   sex
     * }
     */
    'contact-profile': true,

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
     *   bid:
     *   nickname:
     *   headimgid:
     *   place
     *   sex
     * }
     */
    'contact-remarked': true,

    /*
     * {
     *   botid
     *   media_id:
     * }
     */
    'need-login': true,

    /*
     * {
     *   botid
     * }
     */
    'login': true,

    /*
     * {
     *   botid
     * }
     */
    'abort': true
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

    /*
     * {
     *     botid: (String)
     * }
     */
    groupListRequest: 'sbot:group-list-request',

    /*
     * {
     *     botid: (String)
     * }
     */
    contactListRemarkRequest: 'sbot:contact-list-remark-request',

    /*
     * {
     *     botid: (String)
     * }
     */
    contactListRequest: 'sbot:contact-list-request',

    profileResponse: 'sbot:profile',
    groupListResponse: 'sbot:group-list',
    messageReceived: 'sbot:message',
    contactAdded: 'sbot:contact-added',
    contactRemarked: 'sbot:contact-remarked',
    contactProfile: 'sbot:contact-profile',
    needLogin: 'sbot:need-login',
    login: 'sbot:login',
    abort: 'sbot:abort'
};

var WechatBotProxy = function(pub, sub){
    EventEmitter.call(this);
    this.pubClient = pub || pubClient;
    this.subClient = sub || subClient;
};

util.inherits(WechatBotProxy, EventEmitter);

WechatBotProxy.prototype._handleMessage = function(channel, data){
    var oData = JSON.parse(data);
    var event = channel.split(':')[1];
console.info(channel);
console.info(data);
    this.emit(event, oData.err, oData.data);
};

WechatBotProxy.prototype.init = function(){
    this.subClient.subscribe(channels.messageReceived);
    this.subClient.subscribe(channels.profileResponse);
    this.subClient.subscribe(channels.groupListResponse);
    this.subClient.subscribe(channels.contactAdded);
    this.subClient.subscribe(channels.contactRemarked);
    this.subClient.subscribe(channels.contactProfile);
    this.subClient.subscribe(channels.needLogin);
    this.subClient.subscribe(channels.login);
    this.subClient.subscribe(channels.abort);
    this.subClient.on('message', this._handleMessage.bind(this));
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

WechatBotProxy.prototype.requestGroupList = function(botid){
    this.pubClient.publish(channels.groupListRequest, JSON.stringify({botid: botid}));
};

WechatBotProxy.prototype.requestContactListRemark = function(botid){
    this.pubClient.publish(channels.contactListRemarkRequest, JSON.stringify({botid: botid}));
};

WechatBotProxy.prototype.requestContactList = function(botid){
    this.pubClient.publish(channels.contactListRequest, JSON.stringify({botid: botid}));
};


module.exports = WechatBotProxy;







