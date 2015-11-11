var EventEmitter = require('events').EventEmitter;
var util = require('util');
var logger = require('../../../app/logging').logger;
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
    this.bots = {};
    this.botNames = {};
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

    this.proxy.on('group-list', function(err, data){
        if(err){
            logger.error(err);
        }
        else{
            var botInfo = me._decodeBotid(data.botid);
            data.bucketid = botInfo.bucketid;
            data.openid = botInfo.openid;
            data.time = new Date();
            logger.debug(data);
            me.emit('group-list', data);
        }
    });

    this.proxy.on('contact-added', function(err, data){
        if(err){
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

    this.proxy.on('contact-remarked', function(err, data){
        if(err){
            logger.error(err);
        }
        else{
            var botInfo = me._decodeBotid(data.botid);
            data.bucketid = botInfo.bucketid;
            data.openid = botInfo.openid;
            logger.debug(data);
            me.emit('contact-remarked', data);
        }
    });

    this.proxy.on('need-login', function(err, data){
        if(err){
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

    this.proxy.on('login', function(err, data){
        if(err){
            logger.error(err);
        }
        else{
            var botInfo = me._decodeBotid(data.botid);
            data.bucketid = botInfo.bucketid;
            data.openid = botInfo.openid;
            logger.debug(data);
            me.emit('login', data);
        }
    });

    this.proxy.on('abort', function(err, data){
        if(err){
            logger.error(err);
        }
        else{
            var botInfo = me._decodeBotid(data.botid);
            data.bucketid = botInfo.bucketid;
            data.openid = botInfo.openid;
            logger.debug(data);
            me.emit('abort', data);
        }
    });

};

util.inherits(WechatBotManager, EventEmitter);

WechatBotManager.prototype.setProxy = function(proxy){
    this.proxy = proxy;
};

WechatBotManager.prototype.init = function(){
    var me = this;
    this.persister.load(function(err, results){
        if(err){
            me.emit('init-error', err);
        }
        else{
            me._addBots(results);
            me.emit('init', results);
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
            me._addBot(storedBotInfo);
            me.emit('register', storedBotInfo);
            if(callback) callback(null, storedBotInfo);
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
            me._removeBot(botInfo);
            me.emit('unregister', botInfo);
            if(callback) callback(null, botInfo);
        }
    });
};

WechatBotManager.prototype.lock = function(botInfo, callback){
    this.persister.lock(botInfo, callback);
};

/**
 * start a bot
 * @param botInfo bot info {bucketid, openid} which is acted as bot id and identify a bot
 */
WechatBotManager.prototype.start = function(botInfo){
    var botid = typeof botInfo == 'string' ? botInfo : this._encodeBotid(botInfo);
    this.proxy.start(botid);
};

/**
 * stop a bot
 * @param botInfo bot info {bucketid, openid} which is acted as bot id and identify a bot
 */
WechatBotManager.prototype.stop = function(botInfo){
    var botid = typeof botInfo == 'string' ? botInfo : this._encodeBotid(botInfo);
    this.proxy.stop(botid);
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
    var botid = typeof botInfo == 'string' ? botInfo : this._encodeBotid(botInfo);
    msg.MsgType = 'text';
    msg.FromUserName = botid;
    this.proxy.send(msg);
};

/**
 * Request a profile of a user of a bot.
 * @param botInfo bot info {bucketid, openid} which is acted as bot id and identify a bot
 * @param bid
 */
WechatBotManager.prototype.requestProfile = function(botInfo, bid){
    var botid = typeof botInfo == 'string' ? botInfo : this._encodeBotid(botInfo);
    this.proxy.requestProfile(botid, bid);
};

/**
 * Request a group list of a bot.
 * @param botInfo bot info {bucketid, openid} which is acted as bot id and identify a bot
 */
WechatBotManager.prototype.requestGroupList = function(botInfo){
    var botid = typeof botInfo == 'string' ? botInfo : this._encodeBotid(botInfo);
    this.proxy.requestGroupList(botid);
};

WechatBotManager.prototype.requestAllGroupLists = function(){
    for(var botid in this.botNames){
        this.requestGroupList(botid);
    }
};

/**
 * Request to remark all contacts which is not added and remarked after bot is registered.
 * @param botInfo bot info {bucketid, openid} which is acted as bot id and identify a bot
 */
WechatBotManager.prototype.requestContactListRemark = function(botInfo){
    var botid = typeof botInfo == 'string' ? botInfo : this._encodeBotid(botInfo);
    this.proxy.requestContactListRemark(botid);
};

/**
 * Request to get all contacts whatever if it is or not remarked after bot is registered.
 * @param botInfo bot info {bucketid, openid} which is acted as bot id and identify a bot
 */
WechatBotManager.prototype.requestContactList = function(botInfo){
    var botid = typeof botInfo == 'string' ? botInfo : this._encodeBotid(botInfo);
    this.proxy.requestContactList(botid);
};

WechatBotManager.prototype.getBot = function(botid){
    return this.bots[botid];
};

WechatBotManager.prototype.getNameMap = function(){
    return this.botNames;
};

WechatBotManager.prototype.getBotName = function(botid){
    return this.botNames[botid];
};

WechatBotManager.prototype._addBot = function(botInfo){
    var bucket = this.buckets[botInfo.bucketid];

    !bucket && (bucket = this.buckets[botInfo.bucketid] = {});
    bucket[botInfo.openid] = botInfo;

    var botid = this._encodeBotid(botInfo);
    this.bots[botid] = botInfo;
    this.botNames[botid] = botInfo.nickname;

    return botInfo;
};

WechatBotManager.prototype._removeBot = function(botInfo){
    var bucket = this.buckets[botInfo.bucketid];
    var bot = bucket && bucket[botInfo.openid];

    bot && (delete bucket[botInfo.openid]);

    var botid = this._encodeBotid(botInfo);
    this.bots[botid] && (delete this.bots[botid]);
    this.botNames[botid] && (delete this.botNames[botid]);

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

/**
 * set sbot login flag
 * */
WechatBotManager.prototype.setLoginFlag = function(id, flag, callback){
    this.persister.setLoginFlag(id, flag, function(err, data){
        if(err){
            if(callback) callback(err, null);
        }
        else{
            if(callback) callback(null, data);
        }
    });
};
module.exports = WechatBotManager;