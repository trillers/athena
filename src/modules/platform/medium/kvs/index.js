var Promise = require('bluebird');
var u = require('../../../../app/util');
var context = require('../../../../context');

var PlatformWechatSite = require('./PlatformWechatSite');

module.exports.platformWechatSite = Promise.promisifyAll(new PlatformWechatSite(context));

u.extend(context.kvs, module.exports);