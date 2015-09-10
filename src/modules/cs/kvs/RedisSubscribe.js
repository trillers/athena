var cskv = require('./CustomerService');
var redis = require('../../../app/redis-client')('sub');
var co = require('co');
var wechatApi = require('../../wechat/common/api').api;
var ExpiredHandler = require('./handlers/ExpiredHandler');
var DDOrderRejectedHandler = require('./handlers/DDOrderRejectedHandler');
var DDOrderApplyingHandler = require('./handlers/DDOrderApplyingHandler');
var DDOrderUndertakenHandler = require('./handlers/DDOrderUndertakenHandler');
var DDOrderCancelledHandler = require('./handlers/DDOrderCancelledHandler');
var DDOrderApplyingTimeoutHandler = require('./handlers/DDOrderApplyingTimeoutHandler');
var DDOrderInServiceHandler = require('./handlers/DDOrderInServiceHandler');
var DDOrderCompletedHandler = require('./handlers/DDOrderCompletedHandler');

var RedisSubscribe = function(){
    this.redisClient = redis;
    this.redisClientInit();
}

/**
 * DDOrderRejected :
 * DDOrderSubmit
 * DDOrderApplying :
 * DDOrderUndertaken
 * DDOrderCancelled
 * DDOrderApplyingTimeout
 * DDOrderInService
 * DDOrderCompleted
 */

var ChannelHandlerMap = {
    '__keyevent@0__:expired': ExpiredHandler,
    'DDOrderRejected': DDOrderRejectedHandler,
    'DDOrderApplying': DDOrderApplyingHandler,
    'DDOrderUndertaken': DDOrderUndertakenHandler,
    'DDOrderCancelled': DDOrderCancelledHandler,
    'DDOrderApplyingTimeout': DDOrderApplyingTimeoutHandler,
    'DDOrderInService': DDOrderInServiceHandler,
    'DDOrderCompleted': DDOrderCompletedHandler
}

var prototype  = RedisSubscribe.prototype;

prototype.redisClientInit = function(){
    var self = this;
    self.redisClient.subscribe('__keyevent@0__:expired');
    self.redisClient.subscribe('DDOrderRejected');
    self.redisClient.subscribe('DDOrderApplying');
    self.redisClient.subscribe('DDOrderUndertaken');
    self.redisClient.subscribe('DDOrderCancelled');
    self.redisClient.subscribe('DDOrderApplyingTimeout');
    self.redisClient.subscribe('DDOrderInService');
    self.redisClient.subscribe('DDOrderCompleted');

    self.redisClient.on('message', self.handleRedisMessage.bind(self));
}

prototype.handleRedisMessage = function(channel, message){
    co(ChannelHandlerMap[channel](message));
}

module.exports = RedisSubscribe;