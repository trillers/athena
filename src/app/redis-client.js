var settings = require('athena-settings').redis;
var logger = require('./logging').logger;
var redis = require('redis');
var sentinel = require('redis-sentinel');
var DEFAULT_NAME = 'default';
var clients = {};

/*
 * logging methods
 */
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

var redisClient = function(name){
    name = name || DEFAULT_NAME;
    if(clients[name]) return clients[name];
    return clients[name] = createRedisClient(name);
};

var createRedisClient = function(name){
    var redisClient = {};
    if (settings.mode == 'single') {
        redisClient = redis.createClient(settings.port, settings.host, {} ); //TODO: need options
    } else {
        redisClient = sentinel.createClient(settings.sentinel.hosts, settings.sentinel.masterName, {});
    }

    if (settings.auth != '') {redisClient.auth(settings.auth);}

    var url = 'redis://' + redisClient.address;
    redisClient.on('connect'     , infolog('Redis client ' + name + ' is connecting to ' + url));
    redisClient.on('ready'       , infolog('Redis client ' + name + ' is ready'));
    redisClient.on('reconnecting', warnlog('Redis client ' + name + ' is reconnecting to ' + url));
    redisClient.on('error'       , errorlog('Redis client ' + name + ' error happens'));
    redisClient.on('end'         , infolog('Redis client ' + name + ' is ended'));
    return redisClient;
};

module.exports = redisClient;
