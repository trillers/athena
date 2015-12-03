var u = require('../../../../app/util');
var context = require('../../../../context');

var WechatMedium = require('./WechatMedium');
var WechatMediumUser = require('./WechatMediumUser');

module.exports.WechatMedium     = WechatMedium(context.domainBuilder.main);
module.exports.WechatMediumUser = WechatMediumUser(context.domainBuilder.main);

u.extend(context.models, module.exports);