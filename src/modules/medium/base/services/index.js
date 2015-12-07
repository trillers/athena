var Promise = require('bluebird');
var u = require('../../../../app/util');
var context = require('../../../../context');

var WechatMediumService = require('./WechatMediumService');
var WechatMediumUserService = require('./WechatMediumUserService');

module.exports.wechatMediumService = Promise.promisifyAll(new WechatMediumService(context));
module.exports.wechatMediumUserService = Promise.promisifyAll(new WechatMediumUserService(context));

u.extend(context.services, module.exports);