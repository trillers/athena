var wechatUserService = require('../../../user/services/WechatUserService');
var wechatApi = require('../../../wechat/common/api').api;
var commandHandler = function(context){
    var openid = context.weixin.FromUserName;
    wechatUserService.deleteByOpenid(openid, function(err){
        if(err){
            wechatApi.sendTextAsync(openid, '[系统]: 用户 ['+ openid +'] 删除失败');
        }
        else{
            context.getUser().then(function(user){
                wechatApi.sendTextAsync(openid, '[系统]: 用户 ['+ (user && user.wx_nickname || openid) +'] 删除成功');
            });
        }
    });
};
module.exports = commandHandler;