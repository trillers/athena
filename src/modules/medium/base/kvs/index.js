var Promise = require('bluebird');
var u = require('../../../../app/util');
var context = require('../../../../context');

var WechatMedium = require('./WechatMedium');
var WechatMediumUser = require('./WechatMediumUser');

module.exports.wechatMedium = Promise.promisifyAll(new WechatMedium(context));
module.exports.wechatMediumUser = Promise.promisifyAll(new WechatMediumUser(context));

u.extend(context.kvs, module.exports);