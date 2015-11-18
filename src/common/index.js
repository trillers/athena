var context = require('../context');
var _exports = {
    redis: {},
    mongoose: {},
    domainBuilder: {}
};
var getRedisClient = require('../app/redis-client');

context.logger = _exports.logger = require('../app/logging').logger;
context.redis.main = _exports.redis.main = getRedisClient();
context.redis.pub = _exports.redis.pub = getRedisClient('pub');
context.redis.sub = _exports.redis.sub = getRedisClient('sub');
context.mongoose.main = _exports.mongoose.main = require('../app/mongoose');
context.domainBuilder.main = _exports.domainBuilder.main = require('../framework/model/DomainBuilder');


module.exports = _exports;