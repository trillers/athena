var redis = require('../../../app/redis');
var logger = require('../../../app/logging').logger;
var Promise = require('bluebird');
var cbUtil = require('../../../framework/callback');


/**
 * getCurrentCustomerConversationId
 * createCustomerConversation
 * setCurrentCustomerConversationId
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

    getCurrentCustomerConversationId: function(id, callback){},

    createCustomerConversation: function(id, callback){},

    setCurrentCustomerConversationId: function(id, callback){},

    pushMessageToConversation: function(id, callback){},

    getCustomerConversationById: function(id, callback){}
};

module.exports = kvs;