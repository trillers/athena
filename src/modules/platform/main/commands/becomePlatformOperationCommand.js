var context = require('../../../../');
var wechatApi = require('../../../wechat/common/api').api;

module.exports = function (context) {
    var openid = context.weixin.FromUserName;
    console.error(openid);
};