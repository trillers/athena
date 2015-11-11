var settings = require('athena-settings');
var co = require('co');
var Promise = require('bluebird');
var User = require('../models/User').model;
var UserHelper = require('../models/User').helper;
var UserState = require('../../../framework/model/enums').UserState;
var UserSourceType = require('../../common/models/TypeRegistry').item('UserSourceType');

var UserKv = require('../kvs/User');
var WechatWebUserKv = require('../../wechat/kvs/WechatWebUser');
var WechatBotUserKv = require('../../wechat-bot/kvs/WechatBotUser');

var logger = require('../../../app/logging').logger;
var u = require('../../../app/util');
var wechat = require('../../wechat/common/api');
var Service = {};
var cbUtil = require('../../../framework/callback');
var csKvs = require('../../cs/kvs/CustomerService');
var idGenerator = require('../../../app/id');
var generateUserToken = function (uid) {
    var key = settings.secretKey;
    return require('crypto').createHash('sha1').update(String(uid)).update(key).digest('hex');
};

var createModelUser = function (userInfo, callback) {
    var user = new User(userInfo);
    var uid = user.autoId();
    user.token = generateUserToken(uid); //TODO: use token generator
    user.save(function (err, result, affected) {
        //TODO: logging
        //TODO check output doc or json
        cbUtil.handleAffected(callback, err, result, affected);
    });
};
var createModelUserAsync = Promise.promisify(createModelUser);

var updateModelUserByBuid = function (user, update, callback) {
    for(var p in update){
        user[p] = update[p];
    }
    user.save(function(err, doc, numAffected){
        if (err) {
            logger.error('Fail to update user [buid=' + user.bot_uid + ']: ' + err);
            if (callback) callback(err);
        }
        else {
            if(numAffected==1){
                logger.info('Succeed to update user [buid=' + user.bot_uid + ']: ' + JSON.stringify(doc));
                if (callback) callback(null, doc);
            }
            else{
                logger.error('Fail to update user [buid=' + user.bot_uid + ']: no document is affected');
                if (callback) callback(err);
            }
        }
    });
};

var updateModelUserByBuidAsync = Promise.promisify(updateModelUserByBuid);

var loadById = function (id, callback) {
    User.findById(id).exec(function (err, doc) {
        if (err) {
            logger.error('Fail to load user [id=' + id + ']: ' + err);
            if (callback) callback(err);
        }
        else {
            logger.debug('Succeed to load user [id=' + id + ']');
            if (callback) callback(null, doc);
        }
    });
};
var loadByIdAsync = Promise.promisify(loadById);

/**
 * Load User by bot user id
 * @param buid
 * @param callback
 */
var loadByBuid = function (buid, callback) {
    User.findOne({bot_uid: buid}).exec(function (err, doc) {
        if (err) {
            logger.error('Fail to load user [buid=' + buid + ']: ' + err);
            if (callback) callback(err);
        }
        else {
            logger.debug('Succeed to load user [buid=' + buid + ']');
            if (callback) callback(null, doc);
        }
    });
};
var loadByBuidAsync = Promise.promisify(loadByBuid);

Service.loadByBuid = function (buid, callback) {
    return WechatBotUserKv.loadIdByBuidAsync(buid)
        .then(function (id) {
            return id && UserKv.loadByIdAsync(id);
        })
        .then(function (user) {
            if (callback) return callback(null, user);
            return user;
        })
        .catch(Error, function (err) {
            logger.error('Fail to load or create user by buid: ' + err);
            if (callback) callback(err);
        });
};

Service.generateBuid = function() {
    return 'bu-' + idGenerator.next('WechatBotUser').toId();
};

var createUserAsync = function(userInfo, callback){
    return createModelUserAsync(userInfo)
        .then(function (user) {
            return UserHelper.getUserJsonFromModel(user);
        })
        .then(function (userJson) {
            return UserKv.saveByIdAsync(userJson);
        })
        .then(function (userJson) {
            return WechatWebUserKv.linkTokenAsync(userJson.token, userJson.id)
                .then(function () {
                    return userJson;
                });
        })
        .then(function (userJson) {
            return WechatBotUserKv.linkBuidAsync(userJson.bot_uid, userJson.id)
                .then(function () {
                    return userJson;
                });
        })
        .then(function (userJson) {
            if (callback) callback(null, userJson);
            return userJson;
        })
        .catch(Error, function (err) {
            logger.error('Fail to create user from wechat bot: ' + err);
            if (callback) callback(err);
        });
};


Service.createFromContact = function (contactInfo, callback) {
    var userInfo = {};
    userInfo.stt = UserState.Registered;
    userInfo.sourceType = UserSourceType.WechatBot.value();
    userInfo.siteUser = null;
    userInfo.nickname = contactInfo.nickname;
    userInfo.headimgurl = null; //TODO

    userInfo.bot_id = contactInfo.botid;
    userInfo.bot_uid = contactInfo.bid;
    userInfo.bot_nickname = contactInfo.nickname;
    userInfo.bot_headimgid = contactInfo.headimgid || null;
    userInfo.bot_place = contactInfo.place || null;
    userInfo.bot_sex = contactInfo.sex || 0;

    return createUserAsync(userInfo, callback);
};

var updateUserByBuidAsync = function (user, toUpdate, callback) {
    var newUserJson = null;
    return updateModelUserByBuidAsync(user, toUpdate)
        .then(function (user) {
            return newUserJson = UserHelper.getUserJsonFromModel(user);
        })
        .then(function (userJson) {
            return UserKv.saveByIdAsync(userJson);
        })
        .then(function () {
            if (callback) callback(null, newUserJson);
            return newUserJson;
        })
        .catch(Error, function (err) {
            logger.error('Fail to update user from wechat bot: ' + err);
            logger.error(err.stack);
            if (callback) callback(err);
        });
};

var findTheSameSiteUser = function (nickname, callback) {
    User.findOne({wx_nickname: nickname}).exec(function (err, doc) {
        if (err) {
            logger.error('Fail to load the same site user [wx_nickname=' + nickname + ']: ' + err);
            if (callback) callback(err);
        }
        else {
            logger.debug('Succeed to load the same site user [wx_nickname=' + nickname + ']');
            if (callback) callback(null, doc);
        }
    });
};
var findTheSameSiteUserAsync = Promise.promisify(findTheSameSiteUser);

var findTheSameBotUsers = function (nickname, callback) {
    User.find({bot_nickname: nickname}).exec(function (err, docs) {
        if (err) {
            logger.error('Fail to load the same site user [wx_nickname=' + nickname + ']: ' + err);
            if (callback) callback(err);
        }
        else {
            logger.debug('Succeed to load the same site user [wx_nickname=' + nickname + ']');
            if (callback) callback(null, docs);
        }
    });
};
var findTheSameBotUsersAsync = Promise.promisify(findTheSameBotUsers);

Service.updateFromProfile = function (buid, profileInfo, callback) {
    return loadByBuidAsync(buid)
        .then(function (user) {
            if(user){
                var toUpdate = {};
                toUpdate.nickname = profileInfo.nickname;
                toUpdate.headimgurl = null; //TODO

                toUpdate.bot_id = profileInfo.botid;
                toUpdate.bot_uid = profileInfo.bid;
                toUpdate.bot_nickname = profileInfo.nickname;
                toUpdate.bot_headimgid = profileInfo.headimgid;
                toUpdate.bot_place = profileInfo.place;
                toUpdate.bot_sex = profileInfo.sex;

                var nickname = profileInfo.nickname;
                if(!user.siteUser){
                    findTheSameSiteUserAsync(nickname)
                        .then(function(user){
                            return user && user.id;
                        })
                        .then(function(theSameSiteUserId){
                            toUpdate.siteUser = theSameSiteUserId;
                            return updateUserByBuidAsync(user, toUpdate, callback);
                        })
                }
                else{
                    return updateUserByBuidAsync(user, toUpdate, callback);
                }
            }
            else{
                profileInfo.stt = UserState.Registered;
                profileInfo.sourceType = UserSourceType.WechatBot.value();
                profileInfo.siteUser = null;
                return Service.createFromContact(profileInfo, callback);
            }
        });
};

Service.matchTheSameBotUsers = function (userInfo, callback) {
    var siteUserId = userInfo._id;
    return findTheSameBotUsersAsync(userInfo.wx_nickname)
        .then(function(botUsers){
            var ids = [];
            if(botUsers && botUsers.length>0){
                botUsers.forEach(function(user){
                    !user.siteUser && (ids.push(user._id));
                });
                return User.update({_id: {$in: ids}}, {siteUser: siteUserId}, {multi: true}).exec();
            }
            else{
                return null;
            }
        })
        .then(function (updateResult) {
            if (callback) callback(null, updateResult && updateResult.n || 0);
        })
        .catch(Error, function (err) {
            logger.error('Fail to match the same bot users of site user ' + siteUserId + ' : ' + err);
            if (callback) callback(err);
        });
};

Service = Promise.promisifyAll(Service);

module.exports = Service;