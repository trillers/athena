var Promise = require('bluebird');
var co = require('co');
var logger = require('../../../app/logging').logger;
var WechatAuthenticator = require('../../user/services/WechatAuthenticator');
var QrChannelService = require('../../qrchannel/services/QrChannelService');
var authenticator = new WechatAuthenticator({});
var AssistantService = require('../services/AssistantService');
var wechatApi = require('../../wechat/common/api').api;

module.exports = function(emitter){
    emitter.subscribe(function(event, context){
        authenticator.ensureSignin(context.weixin, context, function(err, user){
            if(err){
                logger.error('Fail to sign up: ' + err);
                logger.error(context.weixin);
            }
            else{
                context.user = user;
                console.log(user);
                console.log('sign up a customer user automatically');
            }
        });
    });

    emitter.qr(function(event, context){
        console.log('qr event emit');
        authenticator.ensureSignin(context.weixin, context, function(err, user){
            if(err){
                logger.error('Fail to sigin with user: ' + err);
            }
            else{
                context.user = user;
                //TODO: CODE HERE
                console.log('sign up a customer service user automatically');
            }
            var sceneId = context.weixin.SceneId;
            co(function*(){
                try{
                    var success = false, reply = '系统繁忙，请稍后重试！';
                    var qr = yield QrChannelService.loadBySceneIdAsync(sceneId);
                    console.log(qr);
                    if(qr){
                        switch(qr.type){
                            case 'cs':
                                console.log('cs handler');
                                reply = '欢迎成为客服人员！';
                                try {
                                    success = yield AssistantService.registryCS(user);
                                }catch(err){
                                    console.log(err);
                                }
                                break;
                            case 'ad':
                                console.log('admin handler');
                                reply = '欢迎成为管理员员！';
                                try {
                                    success = yield AssistantService.registryAD(user);
                                }catch(err){
                                    console.log(err);
                                }
                                break;
                            //TODO another qr type
                        }
                        if(success){
                            wechatApi.sendText(user.wx_openid, reply, function(err){
                                console.log(err);
                                //TODO
                            });
                        }
                    }
                    else{
                        reply = '该二维码已失效';
                        wechatApi.sendText(user.wx_openid, reply, function(err){
                            console.log(err);
                            //TODO
                        });
                    }
                }catch(err){
                    logger.err('qr event handler err: ' + err);
                    return;
                }
            });
        });
    });
};