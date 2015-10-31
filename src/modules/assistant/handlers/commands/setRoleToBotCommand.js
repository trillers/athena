var co = require('co');
var wechatApi = require('../../../wechat/common/api').api;
var botUserService = require('../../../wechat-bot/services/BotUserService');
var botManager = require('../../botManager');
var commandHandler = function(context){
    co(function*(){
        yield context.getUser();
        var openid = context.weixin.FromUserName;
        botUserService.setRoleByOpenid(openid, function(err, user){
            if(err){
                wechatApi.sendTextAsync(openid, '[系统]: 用户 ['+ (user && user.wx_nickname || openid) +'] 切换微信助手失败');
            }
            else{
                var botInfo = {
                    bucketid: context.weixin.ToUserName,
                    openid: openid,
                    nickname: user.nickname
                };
                wechatApi.sendTextAsync(openid, '[系统]: 用户 ['+ (user && user.wx_nickname || openid) +'] 切换微信助手成功');
                botManager.register(botInfo, function(){
                    console.log('Succeed to register a wechat bot');
                });
            }
        });
    })

};
module.exports = commandHandler;