var session = require('koa-generic-session');
var redisStore = require('koa-redis');

module.exports = function(){
    return session({
        key: 'koss:test_sid',
        prefix: 'koss:test',
        cookie: {
            maxAge: 60000*60
        },
        store: redisStore(),
        reconnectTimeout: 100
    });
}