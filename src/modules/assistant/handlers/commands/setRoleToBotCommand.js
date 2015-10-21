var wechatApi = require('../../../wechat/common/api').api;
var botService = require('../../../wechat-bot/services/BotUserService');
var co = require('co');
var commandHandler = function(context){
    co(function*(){
        yield context.getUser();
        var openid = context.weixin.FromUserName;
        botService.setRoleByOpenid(openid, function(err, user){
            if(err){
                wechatApi.sendTextAsync(openid, '[系统]: 用户 ['+ (user && user.wx_nickname || openid) +'] 切换微信助手失败');
            }
            else{
                wechatApi.sendTextAsync(openid, '[系统]: 用户 ['+ (user && user.wx_nickname || openid) +'] 切换微信助手成功');
            }
        });
    })

};
module.exports = commandHandler;