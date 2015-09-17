var EventEmitter = require('events').EventEmitter;

/**
 * Wechat site is a 订阅号/服务号 server which can interact with wechat user's client
 * @constructor
 */
var WechatSite = function(wechat, info){
    this.emitter = new EventEmitter();
    this.idOpenids = {};
    this.openidUserInfos = {};
    this.wechat = wechat;
    this.id = wechat._nextId('site');

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
};
WechatSite.prototype.getJson = function(){return this.info};
WechatSite.prototype.getId = function(){return this.info.id;};
WechatSite.prototype._setId = function(id){this.info.id = id;};
WechatSite.prototype.getCode = function(){return this.info.code;};
WechatSite.prototype.setCode = function(code){this.info.code = code;};
WechatSite.prototype.getName = function(){return this.info.name;};
WechatSite.prototype.setName = function(name){this.info.name = name;};
WechatSite.prototype.getHeadimgurl = function(){return this.info.headimgurl;};
WechatSite.prototype.setHeadimgurl = function(headimgurl){this.info.headimgurl = headimgurl;};
WechatSite.prototype.getRegistered = function(){return this.info.registered};
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

WechatSite.prototype.subscribe = function(userId){
    var openid = this.idOpenids[userId];
    openid || (openid = this._createOpenid(userId))

    this.openidUserInfos[openid] = {
        openid: openid,
        subscribed: 1,
        subscribe_time: new Date()
    };
    var message = {};//TODO use stardard wechat format;
    this.emitter.emit('subscribe', message);
};

WechatSite.prototype.unsubscribe = function(openid){
    this.openidUserInfos[openid].subscribed = 0;
    var message = {};//TODO use stardard wechat format;
    this.emitter.emit('unsubscribe', message);
};

WechatSite.prototype.SCAN = function(openid){
    var userInfo = this.openidUserInfos[openid];
    var message = {};//TODO use stardard wechat format;
    this.emitter.emit('SCAN', message);
};

WechatSite.prototype.LOCATION = function(openid, location){
    var userInfo = this.openidUserInfos[openid];
    var message = {};//TODO use stardard wechat format;
    this.emitter.emit('LOCATION', message);
};

WechatSite.prototype.CLICK = function(openid, key){
    var userInfo = this.openidUserInfos[openid];
    var message = {};//TODO use stardard wechat format;
    this.emitter.emit('CLICK', message);
};

WechatSite.prototype.VIEW = function(openid, key){
    var userInfo = this.openidUserInfos[openid];
    var message = {};//TODO use stardard wechat format;
    this.emitter.emit('VIEW', message);
};

WechatSite.prototype.enter = function(openid){
    var userInfo = this.openidUserInfos[openid];
    var message = {};//TODO use stardard wechat format;
    this.emitter.emit('enter', message);
};

WechatSite.prototype.exit = function(openid){
    var userInfo = this.openidUserInfos[openid];
    var message = {};//TODO use stardard wechat format;
    this.emitter.emit('exit', message);
};

WechatSite.prototype.onReceive = function(message){
    this.emitter.emit('message', message);
};

WechatSite.prototype._createOpenid = function(userId){
    return this.idOpenids[userId] = this.wechat._nextId(this.id);
};

module.exports = WechatSite;