var Promise = require('bluebird');
var co = require('co');
var logger = require('../../../app/logging').logger;
var QrChannelService = require('../../qrchannel/services/QrChannelService');
var wechatApi = require('../../wechat/common/api').api;
var tenantService = require('../../../../src').services.tenantService;


module.exports = function (emitter) {
    emitter.qr(function (event, context) {
        co(function*() {
            var sceneId = context.weixin.SceneId;
            var userOpenid = context.weixin.FromUserName;
            try {
                var user = null, reply = '[系统]: 系统繁忙，请稍后重试！';
                var qr = yield QrChannelService.loadBySceneIdAsync(sceneId);
                console.log(qr);
                if (qr) {
                    switch (qr.type) {
                        case 'ta':
                            console.log('tenant admin handler');
                            reply = '[系统]: 注册成功！';
                            yield tenantService.registerTenant(userOpenid);
                            break;
                        //TODO another qr type
                    }
                    wechatApi.sendText(userOpenid, reply, function (err) {
                        console.log(err);
                        //TODO
                    });
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