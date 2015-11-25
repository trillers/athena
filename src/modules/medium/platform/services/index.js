var u = require('../../../../app/util');
var context = require('../../../../context');
var TenantService = require('../../base/services/WechatMediumService');
var PlatformWechatSiteService = require('./PlatformWechatSiteService');
var _exports = {};
_exports.platformWechatSiteService         = new PlatformWechatSiteService(context);
u.extend(context.services, _exports);
module.exports = _exports;