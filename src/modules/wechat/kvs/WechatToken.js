var redis = require('../../../app/redis');
var cbUtil = require('../../../framework/callback');

var ACCESS_TOKEN = 'access';
var JSAPI_TOKEN = 'jsapi';

var tokenKey = function(type){
    return 'wc:token:'+type;
};

var Wechat = {

    saveAccessToken: function(at, callback){
        var key = tokenKey(ACCESS_TOKEN);
        redis.hmset(key, at, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to save wechat access token: ' + err,
                'Succeed to save wechat access token');
            cbUtil.handleOk(callback, err, result, at);
        });
    },

    getAccessToken: function(callback){
        var key = tokenKey(ACCESS_TOKEN);
        redis.hgetall(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to get wechat access token: ' + err,
                'Succeed to get wechat access token');
            cbUtil.handleSingleValue(callback, err, result);
        });
    },

    deleteAccessToken: function(callback){
        var key = tokenKey(ACCESS_TOKEN);
        redis.del(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to invalidate wechat access token: ' + err,
                'Succeed to invalidate wechat access token');
            if(callback) callback(err);
        });
    },

    getTicketToken: function(type, callback){
        var key = tokenKey(type);
        redis.hgetall(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to get wechat ticket token: ' + err,
                'Succeed to get wechat ticket token');
            cbUtil.handleSingleValue(callback, err, result);
        });
    },

    saveTicketToken: function(type, ticketToken, callback){
        var key = tokenKey(type);
        redis.hmset(key, ticketToken, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to save wechat ticket token: ' + err,
                'Succeed to save wechat ticket token');
            cbUtil.handleOk(callback, err, result, ticketToken);
        });
    },

    deleteTicketToken: function(type, callback){
        var key = tokenKey(type);
        redis.del(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to invalidate wechat ticket token: ' + err,
                'Succeed to invalidate wechat ticket token');
            if(callback) callback(err);
        });
    }


};
module.exports = Wechat;