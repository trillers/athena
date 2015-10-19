var EventEmitter = require('events').EventEmitter;
var util = require('util');
var WechatBot = require('./WechatBot');

/**
 * Wechat bot manager is a registry and manager of a bunch of wechat bot accounts which
 * can interact with its contacts and be driven by api.
 * @constructor
 */
var WechatBotManager = function(persister){
    EventEmitter.call(this);
    this.buckets = {};
    this.inited = false;
    this.persister = persister;
};

util.inherits(WechatBotManager, EventEmitter);

WechatBotManager.prototype.isInited = function(){return this.inited;};

WechatBotManager.prototype.get = function(botInfo){
    var bucket = this.buckets[botInfo.bucketid];
    var bot = bucket && bucket[botInfo.openid];
    return bot;
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

WechatBotManager.prototype.init = function(){
    var me = this;
    this.persister.load(function(err, results){
        if(err){
            me.emit('init-error', err);
        }
        else{
            me._addBots(results);
            me.inited = true;
            me.emit('init');
        }
    });
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

module.exports = WechatBotManager;