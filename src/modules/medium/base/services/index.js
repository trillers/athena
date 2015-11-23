var assert = require('assert');
var common = require('../../../../common');
var context = require('../../../../context');
var _exports = {services: {}};
var WechatMediumService = require('./WechatMediumService');
//var WechatMediumUserService = require('./WechatMediumUserService');

//assert.ok(this.redis = context.redis.main, 'no redis main client');

context.services.wechatMediumService       = _exports.services.wechatMediumService        = new WechatMediumService(context);
//context.services.tenantMemberService       = _exports.services.tenantMemberService        = new TenantMemberService(context);

module.exports = _exports;