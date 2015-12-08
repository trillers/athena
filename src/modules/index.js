var _exports = {};
_exports.tenant = require('./tenant');
_exports.medium = {};
_exports.medium.base = require('./medium/base');
_exports.platform = {};
_exports.platform.tenant = require('./platform/tenant');
_exports.platform.medium = require('./platform/medium');
_exports.platform.user = require('./platform/user');
_exports.platform.user = require('./platform/main');

module.exports = _exports;