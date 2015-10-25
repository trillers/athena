var redis = require('../../../app/redis');
var Promise = require('bluebird');
var cbUtil = require('../../../framework/callback');

var openidToIdKey = function(openid){
    return 'usr:oid:' + openid;
};

var Kv = {
    loadIdByOpenid: function(openid, callback){
        var key = openidToIdKey(openid);
        redis.get(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to get user id by openid ' + openid + ': ' + err,
                'Succeed to get user id ' + result + ' by openid ' + openid);
            cbUtil.handleSingleValue(callback, err, result);
        });
    },

    linkOpenid: function(openid, id, callback){
        var key = openidToIdKey(openid);
        redis.set(key, id, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to link openid ' + openid + ' to id ' + id + ': ' + err,
                'Succeed to link openid ' + openid + ' to id ' + id);
            cbUtil.handleOk(callback, err, result);
        });
    },

    unlinkOpenid: function(openid, callback){
        var key = openidToIdKey(openid);
        redis.del(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to delete user id by openid ' + openid + ': ' + err,
                'Succeed to delete user id by openid ' + openid);
            cbUtil.handleSingleValue(callback, err, result);
        });
    }
};

Kv = Promise.promisifyAll(Kv);

module.exports = Kv;