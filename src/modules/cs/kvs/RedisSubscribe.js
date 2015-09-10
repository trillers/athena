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

var MessageHandler = function(){
    this.redisClient = redis;
    this.redisClientInit();
}

/**
 * OrderRejected :
 * OrderSubmit
 * OrderApplying :
 * OrderUndertaken
 * OrderCancelled
 * OrderApplyingTimeout
 * OrderInService
 * OrderCompleted
 */

var ChannelHandlerMap = {
    '__keyevent@0__:expired': ExpiredHandler,
    'ddrejected': DDOrderRejectedHandler,
    'ddapplying': DDOrderApplyingHandler,
    'ddundertaken': DDOrderUndertakenHandler,
    'ddcancelled': DDOrderCancelledHandler,
    'ddapplyingtimeout': DDOrderApplyingTimeoutHandler,
    'ddinservice': DDOrderInServiceHandler,
    'ddcomplete': DDOrderCompletedHandler
}

var prototype  = MessageHandler.prototype;

prototype.redisClientInit = function(){
    var self = this;
    self.redisClient.subscribe('__keyevent@0__:expired');
    self.redisClient.subscribe('ddrejected');
    self.redisClient.subscribe('ddsubmit');
    self.redisClient.subscribe('ddapplying');
    self.redisClient.subscribe('ddundertaken');
    self.redisClient.subscribe('ddcancelled');
    self.redisClient.subscribe('ddapplyingtimeout');
    self.redisClient.subscribe('ddinservice');
    self.redisClient.subscribe('ddcomplete');

    self.redisClient.on('message', self.handleRedisMessage.bind(self));
}

prototype.handleRedisMessage = function(channel, message){
    co(ChannelHandlerMap[channel](message));
}

module.exports = MessageHandler;