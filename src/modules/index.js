var _exports = {};
_exports.tenant = require('./tenant');
_exports.medium = {};
_exports.medium.base = require('./medium/base');
_exports.medium.platform = require('./medium/platform');
_exports.platform = {};
_exports.platform.user = require('./platform/user');

module.exports = _exports;