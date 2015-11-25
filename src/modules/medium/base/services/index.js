var context = require('../../../../context');
var u = require('../../../../app/util');
var _exports = {};
var WechatMediumService = require('./WechatMediumService');
//var WechatMediumUserService = require('./WechatMediumUserService');

_exports.wechatMediumService        = new WechatMediumService(context);
u.extend(context.services, _exports);

module.exports = _exports;