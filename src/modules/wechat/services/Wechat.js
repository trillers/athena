var WechatApi = require('wechat-api');
var WechatKv = require('../kvs/WechatToken');
var WechatErrorHelper = require('../common/WechatErrorHelper');
var logger = require('../../../app/logging').logger;
var Promise = require('bluebird');

var Wechat = function(appKey, secretKey){
    this.appKey = appKey;
    this.secretKey = secretKey;
    this.api = new WechatApi(
        appKey,
        secretKey,
        WechatKv.getAccessToken,
        WechatKv.saveAccessToken
    );

    //Register get and save functions for js ticket
    this.api.registerTicketHandle(WechatKv.getTicketToken, WechatKv.saveTicketToken);
    this.api = Promise.promisifyAll(this.api);
};

var TOKEN_INVALID = 40001;

Wechat.prototype = {
    /**
     * Check if Wechat Access Token is valid by invoking api: get ip
     * @param callback
     */
    checkAccessToken: function(callback){
        this.api.getIp(function(err, result){
            if(err){
                logger.error(WechatErrorHelper.toString(err));
                callback(err, false);
            }
            else{
                callback(null, result && Array.isArray(result.ip_list));
            }
        });
    },

    /**
     * Validate access token whatever it is invalid or valid.
     * @param callback
     */
    validateAccessToken: function(callback){
        var me = this;
        this.checkAccessToken(function(err, result){
            if(err){
                if(err.code && err.code==TOKEN_INVALID){
                    me.api.getAccessToken(function(e, token){
                        if(e){
                            logger.error('Wechat Access Token is NOT requested successfully');
                            if(callback) callback(null, 4);
                        }
                        else{
                            logger.info('Wechat Access Token is requested and updated successfully');
                            if(callback) callback(null, 3);
                        }
                    });
                }
                else {
                    logger.warn('Wechat Access Token is not checked successfully, repeat it soon.');
                    if(callback) callback(null, 2);
                }
            }
            else{
                logger.debug('Wechat Access Token is correct');
                if(callback) callback(null, 1);
            }

        });
    },

    /**
     * Delete Wechat Access Token.
     *
     * Callback:
     * - `err`, Error object
     *
     * @param {Function} callback
     */
    deleteAccessToken: function(callback) {
        WechatKv.deleteAccessToken(callback);
    },

    /**
     * Delete Wechat Ticket Token.
     *
     * Callback:
     * - `err`, Error object
     *
     * @param {String} type ticket type, such as 'jsapi'
     * @param {Function} callback
     */
    deleteTicketToken: function(type, callback) {
        WechatKv.deleteTicketToken(type, callback);
    }

};


module.exports = Wechat;