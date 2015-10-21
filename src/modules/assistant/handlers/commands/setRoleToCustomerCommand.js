var wechatApi = require('../../../wechat/common/api').api;
var customerService = require('../../../customer/services/CustomerService');
var co = require('co');

var commandHandler = function(context){
    co(function*(){
        yield context.getUser();
        var openid = context.weixin.FromUserName;
        customerService.setRoleByOpenid(openid, function(err, user){
            if(err){
                wechatApi.sendTextAsync(openid, '[系统]: 用户 ['+ (user && user.wx_nickname || openid) +'] 切换客户失败');
            }
            else{
                wechatApi.sendTextAsync(openid, '[系统]: 用户 ['+ (user && user.wx_nickname || openid) +'] 切换客户成功');
            }
        });
    });

};
module.exports = commandHandler;