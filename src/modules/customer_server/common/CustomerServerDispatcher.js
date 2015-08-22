var cskv = require('../kvs/CustomerServer');
var redis = require('redis');
var Promise = require('bluebird');

var CustomerServerDispatcher = function(){
    this.handlers = {};
    this.defaultHandler = null;
    this.nullHandler = null;
    this.redisClient = redis.createClient();
    this.redisClientInit();
}

var prototype  = CustomerServerDispatcher.prototype;

prototype.redisClientInit = function(){
    var self = this;
    self.redisClient.subscribe('__keyevent@0__:expired');
    self.redisClient.on('message', self.handleRedisMessage.bind(self));
}

prototype.handleRedisMessage = function(channel, message){
    var key = message;
    console.log('handle expire');
    var prefix = key.slice(0, 6);
    console.log('prefix======'+ prefix);
    var csId = key.slice(6);
    console.log(csId);
    cskv.delCSSByIdAsync(csId)
        .then(function(){
            return cskv.remWcCSSetAsync(csId);
        })
        .then(function(){
            cskv.saveCSStatusByCSOpenIdAsync(csId, 'of');
        })
        .catch(Error, function(err){
            console.log('reset cs error');
            console.log(err);
        });
}

prototype.register = function(handler){
    var key = handler.type;
    this.handlers[key] = handler;
};

prototype.setDefaultHandler = function(handler){
    this.defaultHandler = handler;
};

prototype.setNullHandler = function(handler){
    this.nullHandler = handler;
};

prototype.dispatch = function(user, message){
    var self = this;
    var role = user.role;
    var handler = self.handlers[role];
    console.log(role);
    handler && handler.handle(user, message);
}

module.exports = CustomerServerDispatcher;