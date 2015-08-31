var cskv = require('./CustomerServer');
var redis = require('../../../app/redis');
var wechatApi = require('../../wechat/common/api').api;
var ExpiredHandler = require('./handlers/ExpiredHandler');
var CTRHandler = require('./handlers/CRTHandler');

var MessageHandler = function(){
    this.redisClient = redis;
    this.redisClientInit();
}

var ChannelHandlerMap = {
    '__keyevent@0__:expired': ExpiredHandler,
    'call taxi response': CTRHandler
}

var prototype  = MessageHandler.prototype;

prototype.redisClientInit = function(){
    var self = this;
    self.redisClient.subscribe('__keyevent@0__:expired');
    self.redisClient.subscribe('call taxi response');
    self.redisClient.on('message', self.handleRedisMessage.bind(self));
}

prototype.handleRedisMessage = function(channel, message){
    ChannelHandlerMap[channel](message);
}

module.exports = MessageHandler;