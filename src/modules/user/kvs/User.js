var redis = require('../../../app/redis');
var logger = require('../../../app/logging').logger;
var _ = require('underscore');
var Promise = require('bluebird');
var cbUtil = require('../../../framework/callback');

var idToUserKey = function(id){
    return 'usr:id:' + id;
};

//the session window key that we can initiative to contact user
var idToSessionKey =  function(openid){
    return 'usr:ses:' + openid;
}

var tokenToIdKey = function(token){
    return 'usr:tk:' + token;
};

var openidToIdKey = function(openid){
    return 'usr:oid:' + openid;
};

var openidToAtKey = function(openid){
    return 'usr:oid:at' + openid;
};

var phoneToOidKey = function(phone){
    return 'usr:ph:' + phone;
};

var processUserToSave = function(sourceObject){
    var targetObject = _.clone(sourceObject);
    targetObject.crtOn && (delete targetObject.crtOn);
    targetObject.wx_subscribe_time && (delete targetObject.wx_subscribe_time);

    return targetObject;
};

var User = {

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

    linkPhoneToOpenId: function(phone, openId, callback){
        var key = phoneToOidKey(phone);
        redis.set(key, openId, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to link phone ' + phone + ' to openId ' + openId + ': ' + err,
                'Succeed to link phone ' + phone + ' to openId ' + openId);
            cbUtil.handleOk(callback, err, result);
        });
    },

    loadOpenIdByPhone: function(phone, callback){
        var key = phoneToOidKey(phone);
        redis.get(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to load openId by phone:' + phone + 'err: ' + err,
                'Succeed to load openId by phone:' + phone);
            cbUtil.handleSingleValue(callback, err, result);
        });
    },

    unLinkPhoneToOpenId: function(phone, callback){
        var key = phoneToOidKey(phone);
        redis.del(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to delete phone ' + phone + ' to openId : ' + err,
                'Succeed to delete phone ' + phone + ' to openId ' );
            cbUtil.handleOk(callback, err, result);
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

    loadSessionByOpenid: function(openid, callback){
        var key = idToSessionKey(openid);
        redis.get(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to get user session window by openid ' + openid + ': ' + err,
                'Succeed to get user session window by openid ' + openid);
            cbUtil.handleSingleValue(callback, err, result);
        });
    },

    loadSessionTTLByOpenid: function(openid, callback){
        var key = idToSessionKey(openid);
        redis.ttl(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to get user session window ttl by openid ' + openid + ': ' + err,
                'Succeed to get user session window ttl by openid ' + openid);
            cbUtil.handleSingleValue(callback, err, result);
        });
    },

    saveSessionByOpenid: function(openid, callback){
        var key = idToSessionKey(openid);
        redis.set(key, 'active', 'EX', 172800, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to save user session window by openid ' + openid + ': ' + err,
                'Succeed to save user session window by openid ' + openid);
            cbUtil.handleOk(callback, err, result, 'active');
        });
    },

    deleteSessionByOpenid: function(openid, callback){
        var key = idToSessionKey(openid);
        redis.del(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to delete user session window by openid ' + openid + ': ' + err,
                'Succeed to delete user session window by openid ' + openid);

            cbUtil.handleSingleValue(callback, err, result);
        });
    }
};


User = Promise.promisifyAll(User);

module.exports = User;