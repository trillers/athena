var wechatUserService = require('../../../user/services/WechatUserService');
var wechatApi = require('../../../wechat/common/api').api;
var customerService = require('../../../customer/services/CustomerService');

var commandHandler = function(msg, user){
    customerService.setRoleByOpenid(msg.FromUserName, function(err){
        if(err){
            wechatApi.sendTextAsync(msg.FromUserName, '[系统]: 用户 ['+ (user && user.wx_nickname || msg.FromUserName) +'] 切换普通用户失败');
        }
        else{
            wechatApi.sendTextAsync(msg.FromUserName, '[系统]: 用户 ['+ (user && user.wx_nickname || msg.FromUserName) +'] 切换普通用户成功');
        }
    });
};
module.exports = commandHandler;