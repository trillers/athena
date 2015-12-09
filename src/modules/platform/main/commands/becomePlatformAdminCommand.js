var context = require('../../../../');
var wechatApi = require('../../../wechat/common/api').api;
var logger = context.logger;
var service = context.services.platformService;

module.exports = function (context) {
    var openid = context.weixin.FromUserName;
    service.registerPlatformAdmin(openid, function(err, user){
        if(err){
            var errMsg = '平台管理员创建失败！' + err;
            wechatApi.sendText(openid, errMsg, function(err){
                if(err) logger.error('Fail to sent text to wechat site: ' + err);
            });
        }
        else{
            var msg = '恭喜“' + user.nickname + '”！您现在已经成为平台管理员！';
            wechatApi.sendText(openid, msg, function(err){
                if(err) logger.error('Fail to sent text to wechat site: ' + err);
            });
        }
    });

};