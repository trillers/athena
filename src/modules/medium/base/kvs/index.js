var assert = require('assert');
var context = require('../../../../context');
var WechatMedium = require('./WechatMedium');
var _exports = {};

_exports.wechatMedium        = new WechatMedium(context);

module.exports = context.kvs = _exports;