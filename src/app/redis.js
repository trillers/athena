var settings = require('athena-settings').redis;
var logger = require('./logging').logger;
var redis = require('redis');
var sentinel = require('redis-sentinel');
var redisClient = {};
if (settings.mode == 'single') {
    redisClient = redis.createClient(settings.port, settings.host, {} ); //TODO: need options
} else {
    redisClient = sentinel.createClient(settings.sentinel.hosts, settings.sentinel.masterName, {});
}

if (settings.auth != '') {
    redisClient.auth(settings.auth);
}

var infolog = function (msg) {
    return function() {
        logger.info(msg, arguments);
    }
};
var warnlog = function (msg) {
    return function() {
        logger.warn(msg, arguments);
    }
};
var errorlog = function (msg) {
    return function() {
        logger.error(msg, arguments);
    }
};

var url = 'redis://' + redisClient.address;
redisClient.on('connect'     , infolog('Redis is connecting to ' + url));
redisClient.on('ready'       , infolog('Redis is ready'));
redisClient.on('reconnecting', warnlog('Redis is reconnecting to ' + url));
redisClient.on('error'       , errorlog('Redis error happens'));
redisClient.on('end'         , infolog('Redis is ended'));

var system = require('./system');
system.addMember('redis', redisClient);
redisClient.on('ready'       , function(){
    system.memberUp(redisClient);
});
redisClient.on('error'       , function(){
    system.memberDown(redisClient);
});

module.exports = redisClient;
