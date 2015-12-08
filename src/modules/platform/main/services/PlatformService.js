var cbUtil = require('../../../../framework/callback');
var kv = require('../../../../context').kvs.platformUser;
var TenantMemberRole = require('../../../common/models/TypeRegistry').item('TenantMemberRole');

var co = require('co');


var Service = function(context){
    this.context = context;
};

/**
 * register platform user post
 * @param openid
 * @param role
 * @param callback
 */
Service.prototype.registerPlatformPost = function(openid, role, callback) {
    var self = this;
    var platformTenantService = this.context.services.platformTenantService;
    var platformUserService = this.context.services.platformUserService;
    co(function*(){
        try {
            var id = yield kv.loadIdByOpenidAsync(openid);
            var user = yield kv.loadByIdAsync(id);
            var updateOrAdd = 'add';
            var platform = yield platformTenantService.ensurePlatformAsync();
            if (user) {
                if (user.posts && user.posts.length > 0) {
                    var hasOperationRole = false;
                    var platformPost = null;
                    user.posts.forEach(function (item) {
                        if(item.tenant == platform.id){
                            platformPost = item;
                            return;
                        }
                    })
                    if(platformPost){
                        if(platformPost.role == role) {
                            hasOperationRole = true;
                        }
                        else if(platformPost.role == TenantMemberRole.PlatformOperation.value() && role == TenantMemberRole.PlatformAdmin.value()){
                            hasOperationRole = false;
                            updateOrAdd = 'update';
                        }
                        else{
                            hasOperationRole = true;
                        }
                    }
                    else {
                        hasOperationRole = true;
                    }
                    if (hasOperationRole) {
                        if (callback) callback(null, user);
                        return;
                    }
                }
                var user = yield self.setPlatformUserPostsAsync(user, role, updateOrAdd);
                if (callback) callback(null, user);
                return;
            } else {
                var user = yield platformUserService.createPlatformUserAsync(openid);
                var user = yield self.setPlatformUserPostsAsync(user, role, updateOrAdd);
                if (callback) callback(null, user);
                return;
            }
        }catch(e){
            console.log('registerPlatformOperation err:' + e + '; openid: ' + openid);
        }
    })
};

/**
 * set platform user posts
 * @param user
 * @param role
 * @param updateOrAdd update existed post or add a new post value: 'update' or 'add'
 * @param callback
 */
Service.prototype.setPlatformUserPosts = function(user, role, updateOrAdd, callback){
    var platformTenantService = this.context.services.platformTenantService;
    var tenantMemberService = this.context.services.tenantMemberService;
    var platformUserService = this.context.services.platformUserService;

    co(function*(user){
        var platform = yield platformTenantService.ensurePlatformAsync();
        var update = {};
        var conditions = {}
        if(updateOrAdd === 'add'){
            var tenantMemberJson = {
                tenant: platform.id
                , nickname: user.nickname
                , headimgurl: user.headimgurl
                , role: role
                , remark: user.nickname
            }
            var tenantMember = yield tenantMemberService.createAsync(tenantMemberJson);
            var postJson = {
                tenant: platform.id
                , member: tenantMember._id
                , role: role
            }
            conditions = {
                _id: user._id
            }
            update = {
                $push: {
                    posts: postJson
                }
            }
        } else if(updateOrAdd === 'update'){
            conditions = {
                _id: user._id,
                "posts.tenant": platform.id
            }
            update = {
                $set: { "posts.$.role" : role }
            }
        }

        var user = yield platformUserService.updateAsync(conditions, update);
        if(callback) callback(null, user);
        return ;
    }, user)
}

module.exports = Service;