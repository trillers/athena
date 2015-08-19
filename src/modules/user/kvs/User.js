var redis = require('../../../app/redis');
var logger = require('../../../app/logging').logger;
var _ = require('underscore');
var Promise = require('bluebird');
var cbUtil = require('../../../framework/callback');

var idToUserKey = function(id){
    return 'usr:id:' + id;
};

var tokenToIdKey = function(token){
    return 'usr:tk:' + token;
};

var openidToIdKey = function(openid){
    return 'usr:oid:' + openid;
};

var openidToAtKey = function(openid){
    return 'usr:oid:at' + openid;
};

var idToFlagsKey = function(id){
    return 'usr:flags:' + id;
};

var openidToFlagsKey = function(openid){
    return 'usr:oid:flags:' + openid;
};

var processUserToSave = function(sourceObject){
    var targetObject = _.clone(sourceObject);
    targetObject.crtOn && (delete targetObject.crtOn);
    targetObject.wx_subscribe_time && (delete targetObject.wx_subscribe_time);
    targetObject.contact && (delete targetObject.contact);

    targetObject.latestLatitude && (delete targetObject.latestLatitude);
    targetObject.latestLongitude && (delete targetObject.latestLongitude);
    targetObject.latestPrecision && (delete targetObject.latestPrecision);
    targetObject.latestLocationTime && (delete targetObject.latestLocationTime);
    targetObject.latestLocationCity && (delete targetObject.latestLocationCity);
    targetObject.latestLocationAddress && (delete targetObject.latestLocationAddress);

    return targetObject;
};

var User = {

    loadIdByToken: function(token, callback){
        var key = tokenToIdKey(token);
        redis.get(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to get user id by token ' + token + ': ' + err,
                'Succeed to get user id ' + result + ' by token ' + token);
            cbUtil.handleSingleValue(callback, err, result);
        });
    },

    linkToken: function(token, id, callback){
        var key = tokenToIdKey(token);
        redis.set(key, id, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to link token ' + token + ' to id ' + id + ': ' + err,
                'Succeed to link token ' + token + ' to id ' + id);
            cbUtil.handleOk(callback, err, result);
        });
    },

    unlinkToken: function(token, callback){
        var key = tokenToIdKey(token);
        redis.del(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to delete user id by token ' + token + ': ' + err,
                'Succeed to delete user id by token ' + token);
            cbUtil.handleSingleValue(callback, err, result);
        });
    },

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
    },

    loadById: function(id, callback){
        var key = idToUserKey(id);
        redis.hgetall(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to get user by id ' + id + ': ' + err,
                'Succeed to get user by id ' + id);
            cbUtil.handleSingleValue(callback, err, result);
        });
    },

    saveById: function(user, callback){
        var key = idToUserKey(user.id);
        var userToSave = processUserToSave(user);
        redis.hmset(key, userToSave, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to save user by id ' + user.id + ': ' + err,
                'Succeed to save user by id ' + user.id);
            cbUtil.handleOk(callback, err, result, userToSave);
        });
    },

    updateUserRoleById: function(id, role, callback){
        var key = idToUserKey(id);
        redis.hset(key, 'role', role, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to save user by id ' + id + ': ' + err,
                'Succeed to save user by id ' + id);
            cbUtil.handleAffected(callback, err, role, result);
        });
    },

    deleteById: function(id, callback){
        var key = idToUserKey(id);
        redis.del(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to delete user by id ' + id + ': ' + err,
                'Succeed to delete user by id ' + id);

            cbUtil.handleSingleValue(callback, err, result);
        });
    },

    getAccessToken: function(openid, callback){
        var key = openidToAtKey(openid);
        redis.get(key, function(err, result){
            cbUtil.handleOk(callback, err, result, result);
        });
    },

    saveAccessToken: function(openid, accessToken, callback){
        var key = openidToAtKey(openid);
        redis.set(key, accessToken, function(err, result){
            cbUtil.handleOk(callback, err, result);
        });
    },

    setFlagsByOpenid: function(openid, flags, callback){
        var key = openidToFlagsKey(openid);
        redis.hmset(key, flags, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to set user flags by openid ' + openid + ': ' + err,
                'Succeed to set user flags by openid ' + openid);
            cbUtil.handleOk(callback, err, result, flags);
        });
    },

    getFlagsByOpenid: function(openid, callback){
        var key = openidToFlagsKey(openid);
        redis.hgetall(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to get user flags by openid ' + openid + ': ' + err,
                'Succeed to get user flags by openid ' + openid);
            cbUtil.handleSingleValue(callback, err, result);
        });
    }

};

User.setFlagResignin = function(openid, resignin, callback){
    var flags = {'resignin': resignin ? 'T' : 'F'};
    User.setFlagsByOpenid(openid, flags, function(err){
        if(callback) callback(err);
    });
};

User.getFlagResignin = function(openid, callback){
    User.getFlagsByOpenid(openid, function(err, flags){
        if(callback) callback(err, flags && flags.resignin === 'T');
    });
};

User = Promise.promisifyAll(User);

User.flags = {
    resignin: 'resignin' //"T": true, "F": false
};

module.exports = User;