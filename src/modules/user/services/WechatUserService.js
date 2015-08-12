var User = require('../models/User').model;
var UserHelper = require('../models/User').helper;
var UserState = require('../framework/model/enums').UserState;
var UserKv = require('../kvs/User');
var time = require('../app/time');
var settings = require('athena-settings');
var logger = require('../app/logging').logger;
var u = require('../app/util');
var wechat = require('../app/wechat/api');
var Service = {};
var Promise = require('bluebird');
var cbUtil = require('../framework/callback');

var generateUserToken = function(uid){
    var key = settings.secretKey;
    return require('crypto').createHash('sha1').update(String(uid)).update(key).digest('hex');
};

Promise.promisifyAll(User);
var createUser = function (userInfo, callback) {
    var user = new User(userInfo);
    var uid = user.autoId();
    user.token = generateUserToken(uid); //TODO: use token generator
    user.save(function (err, result, affected) {
        //TODO: logging
        cbUtil.handleAffected(callback, err, result, affected);
    });
};
var createUserAsync = Promise.promisify(createUser);
var updateUser = function (id, update, callback) {
    User.update({_id: id}, update, function (err, doc) {
        if (err) {
            logger.error('Fail to update user [id=' + id + ']: ' + err);
            if (callback) callback(err);
        }
        else{
            if (callback) callback(null, doc);
        }
    });
};
var updateUserAsync = Promise.promisify(updateUser);

var loadById = function(id, callback){
    User.findById(id).exec(function(err, doc){
        if (err) {
            logger.error('Fail to load user [id=' + id + ']: ' + err);
            if(callback) callback(err);
        }
        else{
            logger.debug('Succeed to load user [id=' + id + ']');
            if(callback) callback(null, doc);
        }
    });
};
var loadByIdAsync = Promise.promisify(loadById);

/**
 *  Create a registered user from wechat, not an anonymous user
 * @param user user json object
 * @param callback
 */
Service.createFromWechat = function (userInfo, callback) {
    if(userInfo.wx_nickname){
        userInfo.stt = UserState.Registered;
    }
    else{
        userInfo.stt = UserState.Registered; //UserState.Registered;
    }
    return createUserAsync(userInfo)
        .then(function (user) {
            return UserHelper.getUserJsonFromModel(user);
        })
        .then(function (userJson) {
            return UserKv.saveByIdAsync(userJson);
        })
        .then(function (userJson) {
            return UserKv.linkTokenAsync(userJson.token, userJson.id)
                .then(function () {
                    return userJson;
                });
        })
        .then(function (userJson) {
            return UserKv.linkOpenidAsync(userJson.wx_openid, userJson.id)
                .then(function () {
                    return userJson;
                });
        })
        .then(function (userJson) {
            if(callback) callback(null, userJson);
            return userJson;
        })
        .catch(Error, function (err) {
            logger.error('Fail to create user from wechat: ' + err);
            if(callback) callback(err);
        });
};

Service.updateFromWechat = function(id, update, callback){
    var newUserJson = null;
    var toUpdate = {};

    /*
     * Update stt properties
     */
    if(update.wx_nickname){
        toUpdate.stt = UserState.Registered;
    }
    else{
        toUpdate.stt = UserState.Registered; //UserState.Anonymous;
    }

    /*
     * Remove undefined properties voiding update errors
     */
    for (var prop in update) {
        if(typeof update[prop] !== 'undefined'){
            toUpdate[prop] = update[prop];
        }
    }

    return updateUserAsync(id, toUpdate)
        .then(function(){
            return loadByIdAsync(id);
        })
        .then(function(user){
            return newUserJson = UserHelper.getUserJsonFromModel(user);
        })
        .then(function(userJson){
            return UserKv.saveByIdAsync(userJson);
        })
        .then(function(){
            return UserKv.linkTokenAsync(newUserJson.token, newUserJson.id);
        })
        .then(function () {
            if(callback) callback(null, newUserJson);
            return newUserJson;
        })
        .catch(Error, function(err){
            logger.error('Fail to update user from wechat: ' + err);
            if(callback) callback(err);
        });
};

var getUserFromWechat = function(openid, callback){
    wechat.api.getUser(openid, function(err, userInfo){
        if(err){
            if(callback) callback(err);
        }
        else{
            if(callback) callback(null, userInfo);
        }
    });
};
Service.getUserFromWechat = getUserFromWechat;

var getUserFromWechatAsync = Promise.promisify(getUserFromWechat);
Service.getUserFromWechatAsync = getUserFromWechatAsync;

Service.loadOrCreateFromWechat = function(openid, callback){
    return UserKv.loadIdByOpenidAsync(openid)
        .then(function(id){
            return id && UserKv.loadByIdAsync(id);
        })
        .then(function(user){
            if (user) return user;
            return getUserFromWechatAsync(openid)
                .then(function (userInfo) {
                    return UserHelper.getUserJsonFromWechatApi(userInfo)
                })
                .then(Service.createFromWechat);
        })
        .then(function(user){
            if(callback) callback(null, user);
            return user;
        })
        .catch(Error, function (err) {
            logger.error('Fail to load or create user by openid: ' + err);
            if(callback) callback(err);
        });
};

Service.deleteByOpenid = function(openid, callback){
    return UserKv.loadIdByOpenidAsync(openid)
        .then(function(id){
            return id && UserKv.loadByIdAsync(id);
        })
        .then(function(user){
            if (user) return user;
            return getUserFromWechatAsync(openid)
                .then(function (userInfo) {
                    return UserHelper.getUserJsonFromWechatApi(userInfo);
                })
                .then(Service.createFromWechat);
        })
        .then(function(user){
            if(callback) callback(null, user);
            return user;
        })
        .catch(Error, function (err) {
            logger.error('Fail to delete user by openid: ' + err);
            if(callback) callback(err);
        });
};

Service.createOrUpdateFromWechatOAuth = function(oauth, callback){
    var newUserJson = null;
    var openid = oauth.openid;
    return getUserFromWechatAsync(openid)
        .then(function (userJson) {
            return newUserJson = UserHelper.mergeUserInfo(oauth, userJson);
        })
        .then(function(userJson){
            return UserKv.loadIdByOpenidAsync(openid);
        })
        .then(function(id){
            if(id){
                return Service.updateFromWechat(id, newUserJson);
            }
            else{
                return Service.createFromWechat(newUserJson);
            }
        })
        .then(function(userJson){
            if(callback) callback(null, userJson);
            return userJson;
        })
        .catch(Error, function (err) {
            logger.error('Fail to create or update user by openid: ' + err);
            if(callback) callback(err);
        });
};

module.exports = Service;