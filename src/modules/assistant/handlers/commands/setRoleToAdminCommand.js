var wechatUserService = require('../../../user/services/WechatUserService');
var wechatApi = require('../../../wechat/common/api').api;
var adminService = require('../../../admin/services/AdminService');
var commandHandler = function(context){
    var openid = context.weixin.FromUserName;
    adminService.setRoleByOpenid(openid, function(err){
        if(err){
            wechatApi.sendTextAsync(openid, '[系统]: 用户 ['+ openid +'] 切换管理员失败');
        }
        else{
            context.getUser().then(function(user){
                wechatApi.sendTextAsync(openid, '[系统]: 用户 ['+ (user && user.wx_nickname || openid) +'] 切换管理员成功');
            });
        }
    });
};
module.exports = commandHandler;