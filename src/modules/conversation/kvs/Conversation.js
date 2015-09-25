var redis = require('../../../app/redis');
var logger = require('../../../app/logging').logger;
var Promise = require('bluebird');
var cbUtil = require('../../../framework/callback');

/**
 * getCurrentCustomerConversationId
 * createCustomerConversation
 * setCurrentCustomerConversationId
 * pushMessageToConversation
 * getCustomerConversationById
 *
 */
var userIdToCvsIdKey = function(userId){
    return 'usr:id->cvs:id:' + userId;
};

var cvsIdToObjectKey = function(cvsId){
    return 'cvs:id->o' + cvsId;
};

var cvsIdToMessagesKey = function(cvsId){
    return 'cvs:id->msgs:' + cvsId;
};

var kvs = {

    getCurrentId: function(userId, callback){
        var key = userIdToCvsIdKey(userId);
        redis.get(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to get user id by token ' + token + ': ' + err,
                'Succeed to get user id ' + result + ' by token ' + token);
            cbUtil.handleSingleValue(callback, err, result);
        });
    },

    setCurrentId: function(userId, cvsId, callback){
        var key = userIdToCvsIdKey(userId);
        redis.set(key, id, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to link token ' + token + ' to id ' + id + ': ' + err,
                'Succeed to link token ' + token + ' to id ' + id);
            cbUtil.handleOk(callback, err, result);
        });
    },

    saveById: function(cvs, callback){
        var key = cvsIdToObjectKey(cvs.id);
        redis.hmset(key, cvs, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to save user by id ' + user.id + ': ' + err,
                'Succeed to save user by id ' + user.id);
            cbUtil.handleOk(callback, err, result, userToSave);
        });
    },

    loadById: function(cvsId, callback){
        var key = cvsIdToObjectKey(cvs.id);
    },

    pushMessage: function(cvsId, msg, callback){
        var key = cvsIdToMessagesKey(cvsId);
    },

    getMessages: function(cvsId, callback){
        var key = cvsIdToMessagesKey(id);
    }

};

kvs = Promise.promisifyAll(kvs);

module.exports = kvs;