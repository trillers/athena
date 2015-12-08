var Promise = require('bluebird');
var co = require('co');
var logger = require('../../../app/logging').logger;
var QrChannelService = require('../../qrchannel/services/QrChannelService');
var wechatApi = require('../../wechat/common/api').api;
var csService = require('../../cs/services/CsService');
var adminService = require('../../admin/services/AdminService');

module.exports = function (emitter) {
    var createCustomer = require('./commands/createCustomerCommand');
    emitter.event(function (event, context) {
        console.log(context.weixin);    
    });
    emitter.subscribe(function(event, context){
        createCustomer(event, context, function(err){
            if(!err){
                var msg = context.weixin;
                var ctx = {};
                ctx.weixin = {
                    ToUserName: msg.ToUserName
                    , FromUserName: msg.FromUserName
                    , CreateTime: msg.CreateTime
                    , MsgType: 'text'
                    , MsgId: new Date().getTime()
                    , Content: '我刚刚关注，请为我服务!'
                };
                ctx.wxsession = context.wxsession;
                emitter.relay(ctx);
            }
        });
    });

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
                            user = yield csService.setRoleByOpenidAsync(userOpenid);
                            break;
                        case 'ad':
                            console.log('admin handler');
                            reply = '[系统]: 欢迎成为管理员！';
                            user = yield adminService.setRoleByOpenidAsync(userOpenid);
                            break;
                        case 'ta':
                            console.log('tenant admin handler');
                            reply = '[系统]: 注册成功！';
                            //user = yield tenantHandler.registryTenant(userOpenid);
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