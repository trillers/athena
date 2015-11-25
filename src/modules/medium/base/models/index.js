var context = require('../../../../context');
var _exports = {models: {}};
var WechatMedium = require('./WechatMedium');
var WechatMediumUser = require('./WechatMediumUser');

//assert.ok(this.redis = context.redis.main, 'no redis main client');

context.models.WechatMedium       = _exports.models.WechatMedium        = WechatMedium(context.domainBuilder.main);
context.models.WechatMediumUser = _exports.models.WechatMediumUser  = WechatMediumUser(context.domainBuilder.main);

module.exports = _exports;