var customerService = require('../../../customer/services/CustomerService');
var wechatApi = require('../../../wechat/common/api').api;
var Promise = require('bluebird');

var createCustomer = function(event, context, callback){
    var openid = context.weixin.FromUserName;
    customerService.createFromOpenid(openid, function(err, user){
        if(err){
            wechatApi.sendTextAsync(openid, '[系统]: 用户 ['+ openid +'] 创建失败');
            callback(err)
        }
        else{
            wechatApi.sendTextAsync(openid, '[系统]: 用户 ['+ (user && user.wx_nickname || openid) +'] 创建成功');
            callback(null)
        }
    });
};
module.exports = createCustomer;