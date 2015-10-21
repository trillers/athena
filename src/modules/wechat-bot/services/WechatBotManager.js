var EventEmitter = require('events').EventEmitter;
var util = require('util');
var logger = require('../../../app/logging').logger;
var WechatBot = require('./WechatBot');
var WechatBotService = require('./WechatBotService');
var WechatBotProxy = require('../proxy/WechatBotProxy');

/**
 * Wechat bot manager is a registry and manager of a bunch of wechat bot accounts which
 * can interact with its contacts and be driven by api.
 * @constructor
 */
var WechatBotManager = function(){
    EventEmitter.call(this);
    this.buckets = {};
    this.persister = WechatBotService;
    this.proxy = new WechatBotProxy();

    var me = this;
    this.proxy.on('message', function(err, data){
        if(err){
            logger.error(err);
        }
        else{
            var botInfo = me._decodeBotid(data.ToUserName);
            data.bucketid = botInfo.bucketid;
            data.openid = botInfo.openid;
            logger.debug(data);
            me.emit('message', data);
        }
    });

    this.proxy.on('profile', function(err, data){
        if(err){
            //TODO
            logger.error(err);
        }
        else{
            var botInfo = me._decodeBotid(data.botid);
            data.bucketid = botInfo.bucketid;
            data.openid = botInfo.openid;
            logger.debug(data);
            me.emit('profile', data);
        }
    });

    this.proxy.on('contact-added', function(err, data){
        if(err){
            //TODO
            logger.error(err);
        }
        else{
            var botInfo = me._decodeBotid(data.botid);
            data.bucketid = botInfo.bucketid;
            data.openid = botInfo.openid;
            logger.debug(data);
            me.emit('contact-added', data);
        }
    });

    this.proxy.on('need-login', function(err, data){
        if(err){
            //TODO
            logger.error(err);
        }
        else{
            var botInfo = me._decodeBotid(data.botid);
            data.bucketid = botInfo.bucketid;
            data.openid = botInfo.openid;
            logger.debug(data);
            me.emit('need-login', data);
        }
    });

};

util.inherits(WechatBotManager, EventEmitter);

WechatBotManager.prototype.init = function(){
    var me = this;
    this.persister.load(function(err, results){
        if(err){
            me.emit('init-error', err);
        }
        else{
            me._addBots(results);
            me.emit('init');
        }
    });
};

/**
 * add bot by subscribed user in wechat site
 * @param botUser
 * {
 *   bucketid (String)
 *   openid (String)
 *   nickname (String)
 * }
 * @param callback (Function)
 * @returns {*}
 */
WechatBotManager.prototype.register = function(botInfo, callback){
    var me = this;
    this.persister.add(botInfo, function(err, storedBotInfo){
        if(err){
            me.emit('register-error', err);
            if(callback) callback(err);
        }
        else{
            var bot = me._addBot(storedBotInfo);
            me.emit('register', bot);
            if(callback) callback(null, bot);
        }
    });
};

WechatBotManager.prototype.unregister = function(botInfo, callback){
    var me = this;
    this.persister.remove(botInfo, function(err){
        if(err){
            me.emit('unregister-error', err);
            if(callback) callback(err);
        }
        else{
            var bot = me._removeBot(botInfo);
            me.emit('unregister', bot);
            if(callback) callback(null, bot);
        }
    });
};

/**
 * start a bot
 * @param botInfo bot info {bucketid, openid} which is acted as bot id and identify a bot
 */
WechatBotManager.prototype.start = function(botInfo){
    this.proxy.start({
        botid: this._encodeBotid(botInfo)
    });
};

/**
 * stop a bot
 * @param botInfo bot info {bucketid, openid} which is acted as bot id and identify a bot
 */
WechatBotManager.prototype.stop = function(botInfo){
    this.proxy.stop({
        botid: this._encodeBotid(botInfo)
    });
};

/**
 * @param botInfo bot info {bucketid, openid} which is acted as bot id and identify a bot
 * @param msg
 *  {
 *      ToUserName: bid
 *      FromUserName: botid (bucketid:openid)
 *      MsgType: 'text'
 *      Content: to-be-sent text String
 *  }
 */
WechatBotManager.prototype.sendText = function(botInfo, msg){
    msg.MsgType = 'text';
    msg.FromUserName = this._encodeBotid(botInfo);
    this.proxy.send(msg);
};

/**
 * @param botInfo bot info {bucketid, openid} which is acted as bot id and identify a bot
 * @param bid
 */
WechatBotManager.prototype.requestProfile = function(botInfo, bid, callback){
    this.proxy.requestProfile({
        botid: this._encodeBotid(botInfo),
        bid: bid
    });

    //var me = this;
    //this.proxy.requestProfile(this._encodeBotid(info), info.bid, function(err, profile){
    //    var from = me._decodeBotid(profile.botid);
    //    profile.bucketid = from.bucketid;
    //    profile.openid = from.openid;
    //    if(callback) callback(err, profile);
    //});
};

WechatBotManager.prototype._get = function(botInfo){
    var bucket = this.buckets[botInfo.bucketid];
    var bot = bucket && bucket[botInfo.openid];
    return bot;
};

WechatBotManager.prototype._addBot = function(botInfo){
    var bot = new WechatBot(botInfo);
    var bucket = this.buckets[botInfo.bucketid];

    !bucket && (bucket = this.buckets[botInfo.bucketid] = {});
    bucket[botInfo.openid] = bot;

    return bot;
};

WechatBotManager.prototype._removeBot = function(botInfo){
    var bucket = this.buckets[botInfo.bucketid];
    var bot = bucket && bucket[botInfo.openid];

    bot && (delete bucket[botInfo.openid]);

    return bot;
};

WechatBotManager.prototype._addBots = function(botInfos){
    for(var i=0; i < botInfos.length; i++){
        this._addBot(botInfos[i]);
    }
};

WechatBotManager.prototype._encodeBotid = function(botInfo){
    return botInfo.bucketid + ':' + botInfo.openid;
};

WechatBotManager.prototype._decodeBotid = function(botid){
    var parts = botid.split(':');
    return {
        bucketid: parts[0],
        openid: parts[1]
    };
};

module.exports = WechatBotManager;