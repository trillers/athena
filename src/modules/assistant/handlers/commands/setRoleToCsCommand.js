var wechatUserService = require('../../../user/services/WechatUserService');
var wechatApi = require('../../../wechat/common/api').api;
var csService = require('../../../cs/services/CsService');

var commandHandler = function(msg, user){
    csService.setRoleByOpenid(msg.FromUserName, function(err){
        if(err){
            wechatApi.sendTextAsync(msg.FromUserName, '[系统]: 用户 ['+ (user && user.wx_nickname || msg.FromUserName) +'] 切换客服失败');
        }
        else{
            wechatApi.sendTextAsync(msg.FromUserName, '[系统]: 用户 ['+ (user && user.wx_nickname || msg.FromUserName) +'] 切换客服成功');
        }
    });
};
module.exports = commandHandler;