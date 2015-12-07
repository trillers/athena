var u = require('../../../../app/util');
var context = require('../../../../context');

var PlatformWechatSite = require('./PlatformWechatSite');

module.exports.platformWechatSite        = new PlatformWechatSite(context);

u.extend(context.kvs, module.exports);