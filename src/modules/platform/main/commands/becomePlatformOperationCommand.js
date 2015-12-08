var context = require('../../../../');
var wechatApi = require('../../../wechat/common/api').api;
var TenantMemberRole = require('../../../../../src/modules/common/models/TypeRegistry').item('TenantMemberRole');
var logger = context.logger;
var service = context.services.platformService;

module.exports = function (context) {
    var openid = context.weixin.FromUserName;
    service.registerPlatformPost(openid, TenantMemberRole.PlatformOperation.value(), function(err, user){
        if(err){
            var errMsg = '平台运营专员创建失败！' + err;
            wechatApi.sendText(openid, errMsg, function(err){
                if(err) logger.error('Fail to sent text to wechat site: ' + err);
            });
        }
        else{
            var msg = '恭喜“' + user.nickname + '”！您现在已经成为平台运营专员！';
            wechatApi.sendText(openid, msg, function(err){
                if(err) logger.error('Fail to sent text to wechat site: ' + err);
            });
        }
    });

};