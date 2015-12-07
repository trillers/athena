var cbUtil = require('../../../../framework/callback');
var TenantMemberRole = require('../../../common/models/TypeRegistry').item('TenantMemberRole');


var Service = function(context){
    this.context = context;
};

Service.prototype.registerPlatformOperation = function(openid, callback) {
    /*
    user = kv.loadByOpenid(openid);
    if(user){
        var hasOperationRole = if user.posts has TenantMemberRole.PlatformOperation.value() or TenantMemberRole.PlatformAdmin.value
        if( !hasOperationRole ){
            add platform member
            add user an operation role

        }
        return user;
    }
    else{
        var userInfo = wechatApi.getUser(openid);
        var userJson <-- userInfo;
        var user = platformUserService.create(userJson);
        var platformWechatSite = getPlatformWechatSite();

        userInfo.user = user.id;
        var wechatSiteUser = PlatformWechatSiteService.addUser(platformWechatSite.id, userInfo);

        var platformOperation = {
            nickname: userInfo.nickname,
            headimgurl: userInfo.headimgurl,
            role: TenantMemberRole.PlatformOperation.value()
        };
        platformMemberService.createMember(platformOperation);
        add a post to user.posts

        return user;
    }

    */

};


module.exports = Service;