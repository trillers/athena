var Promise = require('bluebird');
var u = require('../../../../app/util');
var context = require('../../../../context');

var PlatformWechatSiteService = require('./PlatformWechatSiteService');
var PlatformWechatSiteUserService = require('./PlatformWechatSiteUserService');

module.exports.platformWechatSiteService = Promise.promisifyAll(new PlatformWechatSiteService(context));
module.exports.platformWechatSiteUserService = Promise.promisifyAll(new PlatformWechatSiteUserService(context));

u.extend(context.services, module.exports);