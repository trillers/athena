var Promise = require('bluebird');
var logger = require('../../../app/logging').logger;
var cbUtil = require('../../../framework/callback');
var WechatBot = require('../models/WechatBot').model;
var lifeFlagEnum = require('../../../framework/model/enums').LifeFlag;
var Service = {};

/**
 * Load wechat bots by id.
 * @param callback
 * @param id
 */
Service.loadById = function(id, callback){
    WechatBot
        .findOne({_id: id, lFlg: 'a'}, null, {lean: true, sort: {bucketid: -1, crtOn: -1}})
        .exec(function(err, result){
            if(err){
                logger.error('Fail to load wechat bots by id: ' + id + ' err: ' + err);
                callback(err);
            }
            else{
                logger.info('Succeed to load wechat bots by id:' + id);
                callback(null, result);
            }
        });
};

/**
 * Load all wechat bots.
 * @param callback
 */
Service.load = function(callback){
    WechatBot
        .find({lFlg: 'a'}, null, {lean: true, sort: {bucketid: -1, crtOn: -1}})
        .exec(function(err, results){
            if(err){
                logger.error('Fail to load all wechat bots: ' + err);
                callback(err);
            }
            else{
                logger.info('Succeed to load all wechat bots');
                callback(null, results);
            }
        });
};

/**
 * TODO
 * @param botInfo
 * @param callback
 */
Service.add = function(botInfo, callback){
    WechatBot
        .findOne({
            bucketid: botInfo.bucketid,
            openid: botInfo.openid
        })
        .exec(function(err, doc){
            if(err){
                logger.error('Fail to find and add wechat bot '+ JSON.stringify(botInfo) + ' : ' + err);
                callback(err);
            }
            else{
                if(doc){
                    logger.info('Succeed to find the specified and existed wechat bot, no need to add it again '+ JSON.stringify(botInfo));
                    callback(null, doc.toObject());
                }
                else{
                    var wechatBot = new WechatBot(botInfo);
                    wechatBot.save(function (err, result, affected) {
                        if(err){
                            logger.error('Fail to add wechat bot: ' + err);
                            callback(err);
                            return;
                        }
                        if (affected == 1) {
                            logger.info('Succeed to add wechat bot ' + JSON.stringify(botInfo));
                            callback(null, result.toObject());
                        }
                        else {
                            callback(new Error('Fail to add wechat bot, no record is affected!'));
                        }
                    });
                }
            }
        });
};

/**
 * TODO
 * @param botInfo
 * @param callback
 */
Service.remove = function(botInfo, callback){
    WechatBot.remove(
        {
            bucketid: botInfo.bucketid,
            openid: botInfo.openid
        },
        function (err) {
            if (err) {
                logger.error('Fail to remove wechat bot '+ JSON.stringify(botInfo) +': ' + err);
                callback(err);
                return;
            }
            else{
                logger.info('Succeed to remove wechat bot ' + JSON.stringify(botInfo));
                callback();
            }
        });
};

Service.lock = function(botInfo, callback){
    WechatBot.findOne(
        {
            bucketid: botInfo.bucketid,
            openid: botInfo.openid
        },
        function (err, user) {
            if (err) {
                logger.error('Fail to lock wechat bot '+ JSON.stringify(botInfo) +': ' + err);
                callback(err);
            }
            else{
                if(user){
                    user.lFlg = lifeFlagEnum.Inactive;
                    user.save(function(err, doc, numAffected){
                        if(err){
                            logger.error('Fail to lock wechat bot ' + JSON.stringify(botInfo) + ' : ' + err);
                            callback(err);
                        }
                        else{
                            if(numAffected){
                                logger.info('Succeed to lock wechat bot ' + JSON.stringify(botInfo));
                            }
                            else{
                                logger.warn('Fail to lock wechat bot ' + JSON.stringify(botInfo) + ', no record is updated.');
                            }
                            callback(null, doc);
                        }
                    });
                }
                else{
                    logger.warn('Fail to lock wechat bot ' + JSON.stringify(botInfo) + ', no record is found ');
                    callback();
                }
            }
        });
};

/**
 * set assistant login flag
 * @param id of bot
 * @param flag true or false
* */
Service.setLoginFlag = function(id, flag, callback){
    WechatBot.findByIdAndUpdate(id, {loginFlag: flag}, function(err, data){
       if(err){
           if(callback) callback(err, null);
       }else{
           if(callback) callback(null, data);
       }
    });
};

Service = Promise.promisifyAll(Service);

module.exports = Service;