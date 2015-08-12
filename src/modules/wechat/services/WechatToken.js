var kv = require('../kvs/Wechat');
var util = require('util');
var request = require('request');
var Promise = require('bluebird');
var logger = require('../../../app/logging').logger;
var time = require('../../../app/time');
var crypto = require('crypto');

var wechat_access_token_url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=%s&secret=%s';
var wechat_js_ticket_url = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=%s&type=jsapi';

var getAccessToken = Promise.promisify(kv.getAccessToken);
var saveAccessToken = Promise.promisify(kv.saveAccessToken);
var requestAccessToken = function(appKey, secretKey, callback){
    var url = util.format(wechat_access_token_url, appKey, secretKey);
    request({
        method: 'get',
        url: url,
        json: true
    }, function (err, response, body) {
        logger.info('request wechat access token: ' + JSON.stringify(body));
        callback(err, body);
    });
};
requestAccessToken = Promise.promisify(requestAccessToken);

var getJsTicket = Promise.promisify(kv.getJsTicket);
var saveJsTicket = Promise.promisify(kv.saveJsTicket);
var requestJsTicket = function(accessToken, callback){
    var url = util.format(wechat_js_ticket_url, accessToken);
    request({
        method: 'get',
        url: url,
        json: true
    }, function (err, response, body) {
        logger.info('request wechat js ticket: ' + JSON.stringify(body));
        callback(err, body);
    });
};
requestJsTicket = Promise.promisify(requestJsTicket);

var getNonce = function(nowMillis){
    nowMillis = nowMillis || time.currentTimeMillis();
    return '' + (nowMillis*37%100000);
};
var getTimeStamp = function(nowMillis){
    nowMillis = nowMillis || time.currentTimeMillis();
    return ''+ Math.floor(nowMillis/1000);
};

var WechatToken = function(appKey, secretKey, beforeExpires){
    this.appKey = appKey;
    this.secretKey = secretKey;
    //by default, request token remotely 10 minutes ahead of expires
    this.beforeExpires = beforeExpires || 600;
};

WechatToken.prototype = {
    getAt: function(force, callback){
        var self = this;
        var promise = null;
        if(force){
            promise = requestAccessToken(self.appKey, self.secretKey)
                .then(function(request){
                    if(request.errcode){
                        var err = new Error(request.errmsg);
                        err.code = request.errcode;
                        err.message = request.errmsg;
                        throw err;
                    }
                    return saveAccessToken({
                        value: request.access_token,
                        expires: request.expires_in
                    });
                });
        }
        else{
            promise = getAccessToken()
                .then(function(atInfo){
                    /*
                     * if not existed, go request token,
                     * and if near expires, go request token ahead of some time
                     */
                    if(!atInfo.value || atInfo.expires<self.beforeExpires){
                        return requestAccessToken(self.appKey, self.secretKey)
                            .then(function(request){
                                if(request.errcode){
                                    var err = new Error(request.errmsg);
                                    err.code = request.errcode;
                                    throw err;
                                }
                                return saveAccessToken({
                                    value: request.access_token,
                                    expires: request.expires_in
                                });
                            });
                    }
                    return atInfo;
                });

        }

        return promise
            .then(function (atInfo) {
                if (callback) callback(null, atInfo);
                return atInfo;
            })
            .catch(Error, function (e) {
                logger.error('Fail to get wechat access token: ' + e);
                if (callback) callback(e);
            });
    },

    getJt: function(force, callback){
        var self = this;
        var promise = null;
        if(force) {
            promise = self.getAt(force).then(function(at){
                if(!at){
                    var err = new Error('no access token for requesting js ticket');
                    throw err;
                }
                else if(at.errcode){
                    var err = new Error(at.errmsg);
                    err.code = at.errcode;
                    err.message = at.errmsg
                    throw err;
                }
                return requestJsTicket(at.value)
                    .then(function(request){
                        if(request.errcode){
                            var err = new Error(request.errmsg);
                            err.code = request.errcode;
                            throw err;
                        }
                        return saveJsTicket({
                            value: request.ticket,
                            expires: request.expires_in
                        });
                    });
            });
        }
        else{
            promise = getJsTicket()
                .then(function(jtInfo){
                    /*
                     * if token is not existed, go request token,
                     * and if it is near expires, go request token ahead of some time
                     */
                    if(!jtInfo.value || jtInfo.expires<self.beforeExpires){
                        return self.getAt(force).then(function(at){
                            return requestJsTicket(at.value)
                                .then(function(request){
                                    if(request.errcode){
                                        var err = new Error(request.errmsg);
                                        err.code = request.errcode;
                                        throw err;
                                    }
                                    return saveJsTicket({
                                        value: request.ticket,
                                        expires: request.expires_in
                                    });
                                });
                        })
                    }
                    return jtInfo;
                });
        }

        return promise.then(function(jtInfo){
                if(callback) callback(null, jtInfo);
                return jtInfo;
            })
            .catch(Error, function(e){
                console.error(e);
                logger.error('Fail to get wechat js ticket: ' + e);
                if(callback) callback(e);
            });
    },

    getJsSignature: function(ticket, noncestr, ts, url){
        var text = 'jsapi_ticket=' +ticket+ '&noncestr=' +noncestr+ '&timestamp=' +ts+ '&url=' + url;
        logger.info('wechat js signature text: '+text);
        var signature = crypto.createHash('sha1').update(text).digest('hex');
        logger.info('wechat js signature: '+signature);
        return signature;
    },

    getJsConfig: function(url, callback){
        var self = this;
        return this.getJt(false).then(function(jt){
            var nowMillis = time.currentTimeMillis();
            var nonce = '' + (nowMillis*37%100000);
            var ts = ''+ Math.floor(nowMillis/1000);
            var signature = self.getJsSignature(jt.value, nonce, ts, url);
            var config = {
                url: url,
                debug: true, //default to debug
                appId: self.appKey,
                timestamp: ts,
                nonceStr: nonce,
                signature: signature,
                jsApiList: [] //default empty api list
            };
            if(callback){
                callback(null, config);
            }
            return config;
        }).catch(Error, function(e){
            logger.error('Fail to get wechat js config: ' + e);
            if(callback){
                callback(e);
            }
        });
    },

    getJc: function(force, url, callback){
        var self = this;
        return this.getJt(force).then(function(jt){
            var nowMillis = time.currentTimeMillis();
            var nonce = getNonce(nowMillis);
            var ts = getTimeStamp(nowMillis);
            var signature = self.getJsSignature(jt.value, nonce, ts, url);
            var config = {
                debug: true, //default to debug
                appId: self.appKey,
                timestamp: ts,
                nonceStr: nonce,
                signature: signature,
                jsApiList: [] //default empty api list
            };
            if(callback){
                callback(null, config);
            }
            return config;
        }).catch(Error, function(e){
            logger.error('Fail to get wechat js config: ' + e);
            if(callback){
                callback(e);
            }
        });
    }

};

module.exports = WechatToken;