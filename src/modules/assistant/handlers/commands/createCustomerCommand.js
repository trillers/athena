var customerService = require('../../../customer/services/CustomerService');
var wechatApi = require('../../../wechat/common/api').api;
var registerCustomer = function(event, context){
    var msg = context.weixin;
    var openid = msg.FromUserName;
    customerService.createFromOpenid(openid, function(err, user){
        if(err){
            wechatApi.sendTextAsync(msg.FromUserName, '[系统]: 用户创建失败'); //TODO
        }
        else{
            wechatApi.sendTextAsync(msg.FromUserName, '[系统]: 用户 ['+ (user && user.wx_nickname || msg.FromUserName) +'] 创建成功');
        }    });
    //authenticator.ensureSignin(context.weixin, context, function(err, user){
    //    if(err){
    //        logger.error('Fail to sign up: ' + err);
    //        logger.error(context.weixin);
    //    }
    //    else{
    //        context.user = user;
    //        console.log(user);
    //        console.log('ensure to sign up a customer user automatically');
    //    }
    //});
};

module.exports = registerCustomer;