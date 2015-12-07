var u = require('../../../../app/util');
var context = require('../../../../context');

var PlatformWechatSiteService = require('./PlatformWechatSiteService');
var PlatformWechatSiteUserService = require('./PlatformWechatSiteUserService');

module.exports.platformWechatSiteService = new PlatformWechatSiteService(context);
module.exports.PlatformWechatSiteUserService = new PlatformWechatSiteUserService(context);

u.extend(context.services, module.exports);