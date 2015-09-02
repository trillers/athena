var cskv = require('./CustomerServer');
var redis = require('../../../app/redis-client')('sub');
var co = require('co');
var wechatApi = require('../../wechat/common/api').api;
var ExpiredHandler = require('./handlers/ExpiredHandler');
var CTResolveHandler = require('./handlers/CTResolveHandler');
var CTCarryHandler = require('./handlers/CTCarryHandler');
var CTCarryHandler = require('./handlers/CTCarryHandler');
var CTGetOnHandler = require('./handlers/CTGetOnHandler');
var CTCompleteHandler = require('./handlers/CTCompleteHandler');
//var CTCancelHandler = require('./handlers/CTCancelHandler');

var MessageHandler = function(){
    this.redisClient = redis;
    this.redisClientInit();
}

var ChannelHandlerMap = {
    '__keyevent@0__:expired': ExpiredHandler,
    'resolve': CTResolveHandler,
    'carry': CTCarryHandler,
    'getOn': CTGetOnHandler,
    'complete': CTCompleteHandler,
    //'cancel': CTCancelHandler
}

var prototype  = MessageHandler.prototype;

prototype.redisClientInit = function(){
    var self = this;
    self.redisClient.subscribe('__keyevent@0__:expired');
    self.redisClient.subscribe('resolve');
    self.redisClient.subscribe('carry');
    self.redisClient.subscribe('getOn');
    self.redisClient.subscribe('complete');
    self.redisClient.subscribe('cancel');
    self.redisClient.on('message', self.handleRedisMessage.bind(self));
}

prototype.handleRedisMessage = function(channel, message){
    co(ChannelHandlerMap[channel](message));
}

module.exports = MessageHandler;