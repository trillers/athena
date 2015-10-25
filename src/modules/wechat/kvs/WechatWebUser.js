var redis = require('../../../app/redis');
var Promise = require('bluebird');
var cbUtil = require('../../../framework/callback');

var tokenToIdKey = function(token){
    return 'usr:uat:' + token;
};

var Kv = {

    loadIdByToken: function(token, callback){
        var key = tokenToIdKey(token);
        redis.get(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to get user id by user-agent token ' + token + ': ' + err,
                'Succeed to get user id ' + result + ' by user-agent token ' + token);
            cbUtil.handleSingleValue(callback, err, result);
        });
    },

    linkToken: function(token, id, callback){
        var key = tokenToIdKey(token);
        redis.set(key, id, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to link user-agent token ' + token + ' to id ' + id + ': ' + err,
                'Succeed to link user-agent token ' + token + ' to id ' + id);
            cbUtil.handleOk(callback, err, result);
        });
    },

    unlinkToken: function(token, callback){
        var key = tokenToIdKey(token);
        redis.del(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to delete user id by user-agent token ' + token + ': ' + err,
                'Succeed to delete user id by user-agent token ' + token);
            cbUtil.handleSingleValue(callback, err, result);
        });
    }
};

Kv = Promise.promisifyAll(Kv);

module.exports = Kv;