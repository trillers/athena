var wechatUserService = require('../../../user/services/WechatUserService');
var wechatApi = require('../../../wechat/common/api').api;
var csService = require('../../../cs/services/CsService');

var commandHandler = function(context){
    var openid = context.weixin.FromUserName;
    csService.setRoleByOpenid(openid, function(err){
        if(err){
            wechatApi.sendTextAsync(openid, '[系统]: 用户 ['+ openid +'] 切换客服失败');
        }
        else{
            context.getUser().then(function(user){
                wechatApi.sendTextAsync(openid, '[系统]: 用户 ['+ (user && user.wx_nickname || openid) +'] 切换客服成功');
            });
        }
    });
};
module.exports = commandHandler;