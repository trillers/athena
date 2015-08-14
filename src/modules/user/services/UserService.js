var User = require('../models/User').model;
var UserHelper = require('../models/User').helper;
var UserState = require('../../../framework/model/enums').UserState;
var UserKv = require('../kvs/User');
var settings = require('athena-settings');
var logger = require('../../../app/logging').logger;
var u = require('../../../app/util');
var wechat = require('../../wechat/common/api');
var Service = {};
var Promise = require('bluebird');
var cbUtil = require('../../../framework/callback');
var userBizService = require('./UserBizService');
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
        //var userBiz = {
        //    user: result._id,
        //    phone: ''
        //}
        //userBizService.create(userBiz, function(err, doc){
        //    if(err){
        //        logger.error('failed to create userBiz');
        //    }
        //})
        cbUtil.handleAffected(callback, err, result, affected);
    });
};
var createUserAsync = Promise.promisify(createUser);

Service.loadById = function(id, callback){
    return UserKv.loadByIdAsync(id)
        .then(function(user){
            if(callback) callback(null, user);
            return user;
        })
        .catch(Error, function (err) {
            logger.error('Fail to load user by id: ' + err);
            if(callback) callback(err);
        });
};

Service.loadByOpenid = function (openid, callback) {
    return UserKv.loadIdByOpenidAsync(openid)
        .then(function(id){
            return id && UserKv.loadByIdAsync(id);
        })
        .then(function(user){
            if(callback) callback(null, user);
            return user;
        })
        .catch(Error, function (err) {
            logger.error('Fail to load user by wechat openid: ' + err);
            if(callback) callback(err);
        });
};

Service.loadByToken = function (token, callback) {
    var tokenId = null;
    var openid = null;
    return UserKv.loadIdByTokenAsync(token)
        .then(function(id){
            return id && UserKv.loadByIdAsync(id);
        })
        .then(function(user){
            tokenId = user.id;
            openid = user.wx_openid;
            if(openid){
                return UserKv.loadIdByOpenidAsync(openid)
                    .then(function(id){
                        return id && UserKv.loadByIdAsync(id);
                    })
                    .then(function(user){
                        if(callback) callback(null, user);
                        return user;
                    })
                    .catch(Error, function (err) {
                        logger.error('Fail to load user by wechat openid: ' + err);
                        if(callback) callback(err);
                    });
            }
            else{
                return user;
            }
        })
        .then(function(user){
            if(callback) callback(null, user);
            return user;
        })
        .catch(Error, function (err) {
            logger.error('Fail to load user by token: ' + err);
            if(callback) callback(err);
        });
};

Service.load = function (id, callback) {
    User.findById(id).lean(true).exec(function(err, doc){
        if (err) {
            logger.error('Fail to load user [id=' + id + ']: ' + err);
            if(callback) callback(err);
            return;
        }

        logger.debug('Succeed to load user [id=' + id + ']');
        if(callback) callback(null, doc);
    });
};


Service.createAnonymously = function (callback) {
    var userInfo = {
        stt: UserState.Anonymous
    };
    return createUserAsync(userInfo)
        .then(function (user) {
            var userJson = user.toObject({virtuals: true});
            userJson.id = user.id;
            return userJson;
        })
        .then(UserKv.saveByIdAsync)
        .then(function (userJson) {
            return UserKv.linkTokenAsync(userJson.token, userJson.id)
                .then(function () {
                    return userJson;
                });
        })
        .then(function (userJson) {
            if(callback) callback(null, userJson);
            return userJson;
        })
        .catch(Error, function (err) {
            logger.error('Fail to create user from anonymous: ' + err);
            if(callback) callback(err);
        });
};

/**
 *  Create a registered user from wechat, not an anonymous user
 * @param user user json object
 * @param callback
 */
Service.createFromWechat = function (userInfo, callback) {
    userInfo.stt = UserState.Registered;
    return createUserAsync(userInfo)
        .then(function (user) {
            return UserHelper.getUserJsonFromModel(user);
        })
        .then(function (userJson) {
            return UserKv.saveByIdAsync(userJson);
        })
        //.then(UserKv.saveByIdAsync)
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
                    return UserHelper.getUserJsonFromWechatApi(userInfo);
                })
                .then(Service.createFromWechat);
        })
        .then(function(user){
            if(callback) callback(null, user);
            return user;
        })
        .catch(Error, function (err) {
            logger.error('Fail to load user by token: ' + err);
            if(callback) callback(err);
        });
};

Service.delete = function(id, callback) {
    User.findByIdAndRemove(id, function(err, doc){
        if (err) {
            logger.error('Fail to delete travel target [id=' + id + ']: ' + err);
            if(callback) callback(err);
            return;
        }

        logger.debug('Succeed to delete travel target [id=' + id + ']');
        if(callback) callback(null, doc);
    });
};


var deleteAsync = Promise.promisify(Service.delete);

Service.deleteByOpenid = function(openid, callback) {
    var userToDelete = null;
    return UserKv.loadIdByOpenidAsync(openid)
        .then(function(id){
            if(id){
                return deleteAsync(id)
                    .then(function(user){
                        userToDelete = user;
                    })
                    .then(function(){
                        if(userToDelete){
                            return UserKv.unlinkTokenAsync(userToDelete.token);
                        }
                    })
                    .then(function(){
                        if(userToDelete){
                            return UserKv.unlinkOpenidAsync(userToDelete.wx_openid);
                        }
                    })
                    .then(function(){
                        if(userToDelete){
                            return UserKv.deleteByIdAsync(userToDelete.id);
                        }
                    })
            }
            else{
                return;
            }
        })
        //.then(function(user){
        //    userToDelete = user;
        //    return UserKv.unlinkTokenAsync(userToDelete.token);
        //})
        //.then(function(){
        //    return UserKv.unlinkOpenidAsync(userToDelete.wx_openid);
        //})
        //.then(function(){
        //    return UserKv.deleteByIdAsync(userToDelete.id);
        //})
        .then(function(){
            if(callback) callback(null, userToDelete);
        })
        .catch(Error, function (err) {
            logger.error('Fail to delete user by id: ' + err);
            if(callback) callback(err);
        });
};

Service.loadMeta = function (uid, callback) {
    UserMetaKv.getMeta(uid, callback);
};


var updateUser = function(id, update, callback){
    User.findByIdAndUpdate(id, update, function (err, result){
        if(err) {
            callback(err);
        } else {
            callback(null, result);
        }
    })
}

var updateUserAsync = Promise.promisify(updateUser)

Service.update = function(id, update, callback){
    return updateUserAsync(id, update)
        .then(function(user){
            if(user){
                var userJson = user.toObject({virtuals: true});
                //TODO: delete some associated properties
                return UserKv.saveByIdAsync(userJson);
            }
            else{
                return null;
            }
        })
        .then(function (user) {
            if(callback) callback(null, user);
            return user;
        })
        .catch(Error, function(err){
            //TODO:
            if(callback) callback(err);
        });
}

Service.resetUser = function(openidArray, update, callback){
    User.update({'wx_openid': {$in: openidArray}}, update, {multi:true}, function(err, result) {
        if(err) {
            callback(err);
        } else {
            callback(null, result);
        }
    });
}

Service = Promise.promisifyAll(Service);
module.exports = Service;