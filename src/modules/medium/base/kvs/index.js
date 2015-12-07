var u = require('../../../../app/util');
var context = require('../../../../context');

var WechatMedium = require('./WechatMedium');
var WechatMediumUser = require('./WechatMediumUser');

module.exports.wechatMedium        = new WechatMedium(context);
module.exports.wechatMediumUser        = new WechatMediumUser(context);

u.extend(context.kvs, module.exports);