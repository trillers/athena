var EventEmitter = require('events').EventEmitter;
var WechatSiteApi = require('./wechat-site-api');

var generateMsgCreateTime = function(){
    return Math.floor((new Date().getTime())/1000);
};
var generateMsgId = function(){
    return new Date().getTime();
};

/**
 * Wechat site is a 订阅号/服务号 server which can interact with wechat user's client
 * @constructor
 */
var WechatSite = function(wechat, info){
    this.emitter = new EventEmitter();
    this.idOpenids = {};
    this.openidUserInfos = {};
    this.wechat = wechat;
    this.id = info.id || wechat._nextId('site');
    this.sessions = {};
    this.sceneIds = {};
    this.tempSceneIds = {};

    var errors = [];
    info.code || (errors.push('need code'));
    info.name || (errors.push('need name'));

    if(errors.length != 0){
        throw new Error(errors.join('\r\n'));
    }

    this.info = {
        code: info.code,
        name: info.name,
        headimgurl: info.headimgurl || 'http://www.jf258.com/uploads/2014-03-30/233454270.jpg', //in case of no icon, use default icon
        registered: false
    };

    this.api = new WechatSiteApi(this);
};
WechatSite.prototype.getJson = function(){return this.info};
WechatSite.prototype.getId = function(){return this.id;};
WechatSite.prototype._setId = function(id){this.id = id;};
WechatSite.prototype.getCode = function(){return this.info.code;};
WechatSite.prototype.setCode = function(code){this.info.code = code;};
WechatSite.prototype.getName = function(){return this.info.name;};
WechatSite.prototype.setName = function(name){this.info.name = name;};
WechatSite.prototype.getHeadimgurl = function(){return this.info.headimgurl;};
WechatSite.prototype.setHeadimgurl = function(headimgurl){this.info.headimgurl = headimgurl;};
WechatSite.prototype.isRegistered = function(){return this.info.registered};
WechatSite.prototype._setRegistered = function(registered){this.info.registered = registered;};
WechatSite.prototype.getQrcode = function(){return this.info.qrcode};
WechatSite.prototype._setQrcode = function(qrcode){this.info.qrcode = qrcode;};


/**
 * user id -> openid
 * @param userId
 * @returns {*}
 */
WechatSite.prototype.getOpenid = function(userId){
    return this.idOpenids[userId];
};

/**
 * openid -> user info
 * @param openid
 * @returns {*}
 */
WechatSite.prototype.getUserInfo = function(openid){
    return this.openidUserInfos[openid];
};

WechatSite.prototype.subscribe = function(userId, openid){
    openid = this._ensureOpenid(userId, openid);

    this.openidUserInfos[openid] = {
        openid: openid,
        subscribed: 1,
        subscribe_time: new Date()
    };
    var message = {
        ToUserName: this.id
        , FromUserName: openid
        , CreateTime: generateMsgCreateTime()
        , MsgType: 'event'
        , Event: 'subscribe'
    };
    this.emitter.emit('raw', message);
    this.emitter.emit('event', message);
    this.emitter.emit('subscribe', message);
    return openid;
};

WechatSite.prototype.unsubscribe = function(openid){
    this.openidUserInfos[openid].subscribed = 0;
    var message = {
        ToUserName: this.id
        , FromUserName: openid
        , CreateTime: generateMsgCreateTime()
        , MsgType: 'event'
        , Event: 'unsubscribe'
    };
    this.emitter.emit('raw', message);
    this.emitter.emit('event', message);
    this.emitter.emit('unsubscribe', message);
};

WechatSite.prototype.SCAN = function(openid){
    var message = {
        ToUserName: this.id
        , FromUserName: openid
        , CreateTime: generateMsgCreateTime()
        , MsgType: 'event'
        , Event: 'SCAN'
    };
    this.emitter.emit('raw', message);
    this.emitter.emit('event', message);
    this.emitter.emit('SCAN', message);
};

WechatSite.prototype.qrsubscribe = function(sceneId, userId, openid){
    openid = this._ensureOpenid(userId, openid);

    this.openidUserInfos[openid] = {
        openid: openid,
        subscribed: 1,
        subscribe_time: new Date()
    };
    var message = {
        ToUserName: this.id
        , FromUserName: openid
        , CreateTime: generateMsgCreateTime()
        , MsgType: 'event'
        , Event: 'subscribe'
        , EventKey: 'qrscene_'+ sceneId
        , Ticket: '' + new Date().getTime()
        , SceneId: ''+sceneId
    };
    this.emitter.emit('raw', message);
    this.emitter.emit('event', message);
    this.emitter.emit('qrsubscribe', message);
    return openid;
};

WechatSite.prototype.qrSCAN = function(sceneId, openid){
    var message = {
        ToUserName: this.id
        , FromUserName: openid
        , CreateTime: generateMsgCreateTime()
        , MsgType: 'event'
        , Event: 'SCAN'
        , EventKey: ''+sceneId
        , Ticket: '' + new Date().getTime()
        , SceneId: ''+sceneId
    };
    this.emitter.emit('raw', message);
    this.emitter.emit('event', message);
    this.emitter.emit('qrSCAN', message);
};

WechatSite.prototype.LOCATION = function(openid, location){
    var message = {
        ToUserName: this.id
        , FromUserName: openid
        , CreateTime: generateMsgCreateTime()
        , MsgType: 'event'
        , Event: 'LOCATION'
        , Latitude: location.latitude
        , Longitude: location.longitude
        , Precision: location.precision
    };
    this.emitter.emit('raw', message);
    this.emitter.emit('event', message);
    this.emitter.emit('LOCATION', message);
};

WechatSite.prototype.CLICK = function(openid, key){
    var message = {
        ToUserName: this.id
        , FromUserName: openid
        , CreateTime: generateMsgCreateTime()
        , MsgType: 'event'
        , Event: 'CLICK'
        , EventKey: key
    };
    this.emitter.emit('raw', message);
    this.emitter.emit('event', message);
    this.emitter.emit('CLICK', message);
};

WechatSite.prototype.VIEW = function(openid, key){
    var message = {
        ToUserName: this.id
        , FromUserName: openid
        , CreateTime: generateMsgCreateTime()
        , MsgType: 'event'
        , Event: 'VIEW'
        , EventKey: key
    };
    this.emitter.emit('raw', message);
    this.emitter.emit('event', message);
    this.emitter.emit('VIEW', message);
};

WechatSite.prototype.enter = function(openid){
    var message = {
        ToUserName: this.id
        , FromUserName: openid
        , CreateTime: generateMsgCreateTime()
        , MsgType: 'event'
        , Event: 'enter'
    };
    this.emitter.emit('raw', message);
    this.emitter.emit('event', message);
    this.emitter.emit('enter', message);
};

WechatSite.prototype.exit = function(openid){
    var message = {
        ToUserName: this.id
        , FromUserName: openid
        , CreateTime: generateMsgCreateTime()
        , MsgType: 'event'
        , Event: 'exit'
    };
    this.emitter.emit('raw', message);
    this.emitter.emit('event', message);
    this.emitter.emit('exit', message);
};

/**
 * @private
 * 发送消息（包括所有非事件消息）
 * @param message
 */
WechatSite.prototype.sendMessage = function(message){
    message.ToUserName = this.id;
    message.CreateTime = '' + generateMsgCreateTime();
    message.MsgId = '' + generateMsgId();
    this.emitter.emit('raw', message);
    this.emitter.emit('message', message);
    this.emitter.emit(message.MsgType, message);
};

/**
 * 发送文本消息
 * Content 文本消息内容
 * @param message
 */
WechatSite.prototype.sendText = function(message){
    message.MsgType = 'text';
    this.sendMessage(message);
};

/**
 * 发送图片消息
 * PicUrl 图片链接
 * MediaId  图片消息媒体id，可以调用多媒体文件下载接口拉取数据。
 * @param message
 */
WechatSite.prototype.sendImage = function(message){
    message.MsgType = 'image';
    this.sendMessage(message);
};

/**
 * 发送语音消息
 * MediaId  图片消息媒体id，可以调用多媒体文件下载接口拉取数据。
 * Format   语音格式，如amr，speex等
 * @param message
 */
WechatSite.prototype.sendVoice = function(message){
    message.MsgType = 'voice';
    this.sendMessage(message);
};

/**
 * 发送视频消息
 * MediaId  图片消息媒体id，可以调用多媒体文件下载接口拉取数据。
 * ThumbMediaId   视频消息缩略图的媒体id，可以调用多媒体文件下载接口拉取数据。
 * @param message
 */
WechatSite.prototype.sendVideo = function(message){
    message.MsgType = 'video';
    this.sendMessage(message);
};

/**
 * 发送小视频消息
 * MediaId  图片消息媒体id，可以调用多媒体文件下载接口拉取数据。
 * ThumbMediaId   视频消息缩略图的媒体id，可以调用多媒体文件下载接口拉取数据。
 * @param message
 */
WechatSite.prototype.sendShortVideo = function(message){
    message.MsgType = 'shortvideo';
    this.sendMessage(message);
};

/**
 * 发送地理位置消息
 * Location_X	地理位置维度
 * Location_Y	地理位置经度
 * Scale	地图缩放大小
 * Label	地理位置信息
 * @param message
 */
WechatSite.prototype.sendLocation = function(message){
    message.MsgType = 'location';
    this.sendMessage(message);
};

/**
 * 发送链接消息
 * Title	    消息标题
 * Description	消息描述
 * Url	        消息链接
 * @param message
 */
WechatSite.prototype.sendLink = function(message){
    message.MsgType = 'link';
    this.sendMessage(message);
};

WechatSite.prototype.on = function(event, handler){
    this.emitter.on(event, handler);
};

WechatSite.prototype.getApi = function(){
    return this.api;
};

WechatSite.prototype._ensureOpenid = function(userId, openid){
    if(openid){
        this.idOpenids[userId] || (this.idOpenids[userId] = openid);
    }
    else{
        openid = this.idOpenids[userId];
        openid || (openid = this.idOpenids[userId] = this.wechat._nextId(this.id))
    }
    return openid;
};

WechatSite.prototype._ensureSession = function(openid){
    if(!this.sessions[openid]){
        this.sessions[openid] = {
            __id: this.wechat._nextId('site-user-session')
        };
    }

    return this.sessions[openid];
};

WechatSite.prototype._isGeneratedSceneId = function(sceneId){
    return this.sceneIds[sceneId];
};

WechatSite.prototype._isGeneratedTempSceneId = function(sceneId){
    return this.tempSceneIds[sceneId];
};

module.exports = WechatSite;