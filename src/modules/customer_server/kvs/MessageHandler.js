var cskv = require('./CustomerServer');
var redis = require('redis').createClient();
var wechatApi = require('../../wechat/common/api').api;
var ExpiredHandler = require('./handlers/ExpiredHandler');
var CTRHandler = require('./handlers/CRTHandler');
var CTStatusHandler = require('./handlers/CTStatusHandler');

var MessageHandler = function(){
    this.redisClient = redis;
    this.redisClientInit();
}

var ChannelHandlerMap = {
    '__keyevent@0__:expired': ExpiredHandler,
    'call taxi response': CTRHandler,
    'call taxi status': CTStatusHandler
}

var prototype  = MessageHandler.prototype;

prototype.redisClientInit = function(){
    var self = this;
    self.redisClient.subscribe('__keyevent@0__:expired');
    self.redisClient.subscribe('call taxi response');
    self.redisClient.subscribe('call taxi status');
    self.redisClient.on('message', self.handleRedisMessage.bind(self));
}

prototype.handleRedisMessage = function(channel, message){
    ChannelHandlerMap[channel](message);
}

module.exports = MessageHandler;