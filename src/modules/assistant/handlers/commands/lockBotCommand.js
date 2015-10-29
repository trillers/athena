var wechatApi = require('../../../wechat/common/api').api;
var botManager = require('../../botManager');
var commandHandler = function(context){
    var bucketid = context.weixin.ToUserName;
    var openid = context.weixin.FromUserName;
    var botInfo = {
        bucketid: bucketid,
        openid: openid
    };
    botManager.lock(botInfo, function(err, user){
        if(err){
            wechatApi.sendText(openid, '[系统]: 用户 ['+ (user && user.nickname || openid) +'] 锁定微信助手失败', function(err){});
        }
        else if(!user){
            wechatApi.sendText(openid, '[系统]: 用户 ['+ (user && user.nickname || openid) +'] 锁定微信助手失败，微信助手不存在或已经锁定', function(err){});
        }
        else{
            wechatApi.sendText(openid, '[系统]: 用户 ['+ (user && user.nickname || openid) +'] 锁定微信助手成功', function(err){});
        }
    });
};
module.exports = commandHandler;