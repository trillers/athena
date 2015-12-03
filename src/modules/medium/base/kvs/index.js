var u = require('../../../../app/util');
var context = require('../../../../context');

var WechatMedium = require('./WechatMedium');

module.exports.wechatMedium        = new WechatMedium(context);

u.extend(context.kvs, module.exports);