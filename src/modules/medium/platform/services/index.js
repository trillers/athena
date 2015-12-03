var u = require('../../../../app/util');
var context = require('../../../../context');

var PlatformWechatSiteService = require('./PlatformWechatSiteService');

module.exports.platformWechatSiteService         = new PlatformWechatSiteService(context);

u.extend(context.services, module.exports);