var redis = require('../../../app/redis');
var logger = require('../../../app/logging').logger;
var Promise = require('bluebird');
var cbUtil = require('../../../framework/callback');

var userIdToCvsIdKey = function(userId){
    return 'usr:id->cvs:id:' + userId;
};

var cvsIdToObjectKey = function(cvsId){
    return 'cvs:id->o' + cvsId;
};

var kvs = {

    getCurrentId: function(userId, callback){
        var key = userIdToCvsIdKey(userId);
        redis.get(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to get conversation id by userId ' + userId + ': ' + err,
                'Succeed to get conversation id ' + result + ' by userId ' + userId);
            cbUtil.handleSingleValue(callback, err, result);
        });
    },

    setCurrentId: function(userId, cvsId, callback){
        var key = userIdToCvsIdKey(userId);
        redis.set(key, cvsId, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to link user id ' + userId + ' to cvs id ' + cvsId + ': ' + err,
                'Succeed to link user id ' + userId + ' to cvs id ' + cvsId);
            cbUtil.handleOk(callback, err, result, cvsId);
        });
    },

    delCurrentId: function(userId, callback){
        var key = userIdToCvsIdKey(userId);
        redis.del(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to del link user id ' + userId + ' to cvs id, err:' + err,
                'Succeed to del link user id ' + userId + ' to cvs id ');
            cbUtil.handleSingleValue(callback, err, result);
        });
    },

    create: function(cvs, callback){
        var key = cvsIdToObjectKey(cvs._id);
        redis.hmset(key, cvs, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to create conversation err: ' + err,
                'Succeed to create customer conversation' );
            cbUtil.handleOk(callback, err, result, cvs);
        });
    },

    loadById: function(cvsId, callback){
        var key = cvsIdToObjectKey(cvsId);
        redis.hgetall(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to load conversation by id ' + cvsId + ': ' + err,
                'Succeed to load conversation by id ' + cvsId);
            cbUtil.handleSingleValue(callback, err, result);
        });
    },

    delById: function(cvsId, callback){
        var key = cvsIdToObjectKey(cvsId);
        redis.del(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to del cvs by id ' + cvsId + ': ' + err,
                'Succeed to del cvs by id ' + cvsId);
            cbUtil.handleSingleValue(callback, err, result);
        });
    }

};

kvs = Promise.promisifyAll(kvs);

module.exports = kvs;