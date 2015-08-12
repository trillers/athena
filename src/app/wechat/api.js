var settings = require('mit-settings');
var Wechat = require('../../services/Wechat');
var wechat = new Wechat(settings.wechat.appKey, settings.wechat.appSecret);

module.exports = wechat;