var Promise = require('bluebird');
var co = require('co');
var logger = require('../../../app/logging').logger;
var WechatAuthenticator = require('../../user/services/WechatAuthenticator');
var QrChannelService = require('../')
var authenticator = new WechatAuthenticator({});
var RoleEmitter = require('../RoleEmitter');
var roleEmitter = new RoleEmitter();
var AssistantService = require('../services/AssistantService');
var wechatApi = require('../../wechat/common/api').api;

require('../../cs/handlers/CsHandler')(roleEmitter);
require('../../admin/handlers/AdminHandler')(roleEmitter);
require('../../customer/handlers/CustomerHandler')(roleEmitter);

module.exports = function(emitter){
    emitter.qr(function(event, context){
        authenticator.ensureSignin(context.weixin, context, function(err, user){
            if(err){
                logger.error('Fail to sigin with user: ' + err);
            }
            else{
                context.user = user;
            }

            var sceneId = context.weixin.SceneId;
            try{
                var success = false, reply = '';
                var qr = yield QrChannelService.loadBySceneIdAsync(sceneId);
                if(qr){
                    switch(qr.type){
                        case 'cs':
                            reply = '欢迎成为客服人员！';
                            success = yield QrChannelService.RegistryCS(user);
                            break;
                        //TODO another qr type
                    }
                    if(!success){
                        reply = '系统繁忙，请稍后重试！';
                    }
                    wechatApi.sendText(user.wx_openid, reply);

                }
                else{
                    reply = '该二维码已失效';
                    wechatApi.sendText(user.wx_openid, reply);
                }
            }catch(err){
                logger.err('qr event handler err: ' + err);
                return;
            }
        });
    });
};