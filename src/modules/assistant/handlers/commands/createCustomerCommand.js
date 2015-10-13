var customerService = require('../../../customer/services/CustomerService');
var wechatApi = require('../../../wechat/common/api').api;
var createCustomer = function(event, context){
    var openid = context.weixin.FromUserName;
    customerService.createFromOpenid(openid, function(err, user){
        if(err){
            wechatApi.sendTextAsync(openid, '[系统]: 用户 ['+ openid +'] 创建失败');
        }
        else{
            wechatApi.sendTextAsync(openid, '[系统]: 用户 ['+ (user && user.wx_nickname || openid) +'] 创建成功');
        }
    });
};

module.exports = createCustomer;