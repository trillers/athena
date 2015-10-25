var redis = require('../../../app/redis');
var Promise = require('bluebird');
var cbUtil = require('../../../framework/callback');

var buidToIdKey = function(buid){
    return 'usr:buid:' + buid;
};

var Kv = {
    loadIdByBuid: function(buid, callback){
        var key = buidToIdKey(buid);
        redis.get(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to get user id by buid (bot user id) ' + buid + ': ' + err,
                'Succeed to get user id ' + result + ' by buid (bot user id) ' + buid);
            cbUtil.handleSingleValue(callback, err, result);
        });
    },

    linkBuid: function(buid, id, callback){
        var key = buidToIdKey(buid);
        redis.set(key, id, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to link buid (bot user id) ' + buid + ' to id ' + id + ': ' + err,
                'Succeed to link buid (bot user id) ' + buid + ' to id ' + id);
            cbUtil.handleOk(callback, err, result);
        });
    },

    unlinkBuid: function(buid, callback){
        var key = buidToIdKey(buid);
        redis.del(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to delete user id by buid (bot user id) ' + buid + ': ' + err,
                'Succeed to delete user id by buid (bot user id) ' + buid);
            cbUtil.handleSingleValue(callback, err, result);
        });
    }
};


Kv = Promise.promisifyAll(Kv);

module.exports = Kv;