var u = require('../../../../app/util');
var context = require('../../../../context');

var WechatMediumService = require('./WechatMediumService');
var WechatMediumUserService = require('./WechatMediumUserService');

module.exports.wechatMediumService        = new WechatMediumService(context);
module.exports.wechatMediumUserService        = new WechatMediumUserService(context);

u.extend(context.services, module.exports);