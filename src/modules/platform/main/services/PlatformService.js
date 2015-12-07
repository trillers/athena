var cbUtil = require('../../../../framework/callback');
var kv = require('../../../../context').kvs.platformUser;
var TenantMemberRole = require('../../../common/models/TypeRegistry').item('TenantMemberRole');
var platformTenantService = require('../../../../context').services
.platformTenantService;
var tenantMemberService = require('../../../../context').services.tenantMemberService;
var platformUserService = require('../../../../context').services.platformUserService;
var co = require('co');


var Service = function(context){
    this.context = context;
};

Service.prototype.registerPlatformOperation = function(openid, callback) {
    co(function*(){
        var self = this;
        var id = yield kv.loadIdByOpenidAsync(openid);
        var user = yield kv.loadByIdAsync(id);
        if(user){
            if(user.posts && user.posts.length > 0){
                var hasOperationRole = false;
                user.posts.forEach(function(item){
                    if(item.role === TenantMemberRole.PlatformOperation.value() || item.role === TenantMemberRole.PlatformAdmin.value()){
                        hasOperationRole = true;
                    }
                })
                if(hasOperationRole){
                    if(callback) callback(err, user);
                    return ;
                }
            }
            var user = self.setPlatfromUserPostsAsync(user);
            if(callback) callback(err, user);
            return ;
        } else{
            var user = yield platformUserService.createPlatformUserAsync(openid);
            var user = self.setPlatfromUserPostsAsync(user);
            if(callback) callback(err, user);
            return ;
        }
    })
};

Service.prototype.setPlatfromUserPosts = function(user, callback){
    co(function*(){
        var platform = yield platformTenantService.ensurePlatformAsync();
        var tenantMemberJson = {
            tenant: platform.id
            , nickname: user.nickname
            , headimgurl: user.headimgurl
            , role: TenantMemberRole.PlatformOperation.value()
            , remark: 'platform operation'
        }
        var tenantMember = yield tenantMemberService.createAsync(tenantMemberJson);
        var postJson = {
            tenant: platform.id
            , member: tenantMember._id
            , role: TenantMemberRole.PlatformOperation.value()
        }
        var conditions = {
            _id: user._id
        }
        var update = {
            $push: {
                posts: postJson
            }
        }
        var user = yield platformUserService.updateAsync(conditions, update);
        if(callback) callback(err, user);
        return ;
    })
}

Service.prototype = Promise.promisifyAll(Service.prototype);

module.exports = Service;