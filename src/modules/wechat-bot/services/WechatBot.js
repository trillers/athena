var EventEmitter = require('events').EventEmitter;

/**
 * Wechat bot is a normal wechat account which can interact with its contacts and
 * be driven by api.
 * @constructor
 */
var WechatBot = function(info){
    //this.emitter = new EventEmitter();
    var errors = [];
    info.bucketid || (errors.push('need bucketid'));
    info.openid || (errors.push('need openid'));
    info.nickname || (errors.push('need nickname'));

    if(errors.length != 0){
        throw new Error(errors.join('\r\n'));
    }

    this.info = {
        bucketid: info.bucketid,
        openid: info.openid,
        nickname: info.nickname
    };

    this.started = false;
};

WechatBot.prototype.isStarted = function(){return this.started;};



module.exports = WechatBot;