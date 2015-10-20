var logger = require('../../../app/logging').logger;
var cbUtil = require('../../../framework/callback');
var WechatBot = require('../models/WechatBot').model;

var Service = {};

/**
 * Load all wechat bots.
 * @param callback
 */
Service.load = function(callback){
    WechatBot
        .find({}, null, {lean: true, sort: {bucketid: -1, crtOn: -1}})
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

module.exports = Service;