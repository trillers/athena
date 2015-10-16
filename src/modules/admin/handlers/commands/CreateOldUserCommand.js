/**
 * when admin send '创建老用户', create users for old users
 */
var wechatApi = require('../../../wechat/common/api').api;
var logger = require('../../../../app/logging').logger;
var Promise = require('bluebird');
var co = require('co');
var wechatUserService = require('../../../user/services/WechatUserService');

module.exports = function (context) {
    var openid = context.weixin.FromUserName;
    co(function*() {
        try {
            var createUsersForOldUserAsync = Promise.promisify(wechatUserService.createUsersForOldUser);
            yield createUsersForOldUserAsync();
            wechatApi.sendTextAsync(openid, '[系统]: 创建老用户成功！');
        } catch (err) {
            console.error('create user for old user err:' + err)
            console.log(err.stack);
            wechatApi.sendTextAsync(openid, '[系统]: 系统繁忙，请稍后重试！');
        }
    });
}