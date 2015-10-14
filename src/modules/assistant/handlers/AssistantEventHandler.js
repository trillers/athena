var Promise = require('bluebird');
var co = require('co');
var logger = require('../../../app/logging').logger;
var QrChannelService = require('../../qrchannel/services/QrChannelService');
var wechatApi = require('../../wechat/common/api').api;
var csService = require('../../cs/services/CsService');
var adminService = require('../../admin/services/AdminService');

module.exports = function (emitter) {
    var createCustomer = require('./commands/createCustomerCommand');
    emitter.subscribe(createCustomer);

    emitter.qr(function (event, context) {
        co(function*() {
            yield context.getUser();
            var sceneId = context.weixin.SceneId;
            var userOpenid = context.weixin.FromUserName;
            try {
                var user = null, reply = '[系统]: 系统繁忙，请稍后重试！';
                var qr = yield QrChannelService.loadBySceneIdAsync(sceneId);
                console.log(qr);
                if (qr) {
                    switch (qr.type) {
                        case 'cs':
                            console.log('cs handler');
                            reply = '[系统]: 欢迎成为客服人员！';
                            try {
                                user = yield csService.setRoleByOpenidAsync(userOpenid);
                            } catch (err) {
                                console.log(err);
                            }
                            break;
                        case 'ad':
                            console.log('admin handler');
                            reply = '[系统]: 欢迎成为管理员！';
                            try {
                                user = yield adminService.setRoleByOpenidAsync(userOpenid);
                            } catch (err) {
                                console.log(err);
                            }
                            break;
                        //TODO another qr type
                    }
                    if (user) {
                        wechatApi.sendText(userOpenid, reply, function (err) {
                            console.log(err);
                            //TODO
                        });
                    }
                }
                else {
                    reply = '[系统]: 该二维码已失效';
                    wechatApi.sendText(userOpenid, reply, function (err) {
                        console.log(err);
                        //TODO
                    });
                }
            } catch (err) {
                logger.err('qr event handler err: ' + err);
                return;
            }
        });
    });
};