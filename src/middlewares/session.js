var session = require('koa-generic-session');
var redisStore = require('koa-redis');
var settings = require('athena-settings').redis;

module.exports = function(){
    return session({
        key: 'koss:test_sid',
        prefix: 'koss:test',
        cookie: {
            maxAge: 60000*60
        },
        store: redisStore({host: settings.host, port: settings.port, pass: settings.auth}),
        reconnectTimeout: 100
    });
}