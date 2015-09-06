var redis = require('../../../app/redis');
var logger = require('../../../app/logging').logger;

var accessTokenKey = function(){
    return 'wc:at';
};

var jsTicketKey = function(){
    return 'wc:jt';
};

var Wechat = {

    getAccessToken: function(callback){
        var key = accessTokenKey();
        var multi = redis.multi();
        multi.get(key);
        multi.ttl(key);
        multi.exec(function(err, results){
            if(err) {
                logger.error('Failed to get and ttl wechat developer AccessToken' + err);
                return callback(err);
            }
            var ret = {
                value: results[0],
                expires: results[1]
            }
            callback(null, ret);
        });
    },

    saveAccessToken: function(atInfo, callback){
        var key = accessTokenKey();
        redis.watch(key);
        var multi = redis.multi();
        multi.set(key, atInfo.value);
        multi.expire(key, atInfo.expires);
        multi.exec(function(err, results){
            if(err) {
                logger.error('Failed to set and expire wechat developer AccessToken' + err);
                return callback(err);
            }
            callback(null, atInfo);
        });
    },

    getJsTicket: function(callback){
        var key = jsTicketKey();
        var multi = redis.multi();
        multi.get(key);
        multi.ttl(key);
        multi.exec(function(err, results){
            if(err) {
                logger.error('Failed to get and ttl wechat developer jsapi ticket' + err);
                return callback(err);
            }
            var ret = {
                value: results[0],
                expires: results[1]
            }
            callback(null, ret);
        });
    },

    saveJsTicket: function(jtInfo, callback){
        var key = jsTicketKey();
        redis.watch(key);
        var multi = redis.multi();
        multi.set(key, jtInfo.value);
        multi.expire(key, jtInfo.expires);
        multi.exec(function(err, results){
            if(err) {
                logger.error('Failed to set and expire wechat developer jsapi ticket' + err);
                return callback(err);
            }
            callback(null, jtInfo);
        });
    }

};
module.exports = Wechat;