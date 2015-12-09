var co = require('co');
var cbUtil = require('../../../../framework/callback');
var TenantMemberRole = require('../../../common/models/TypeRegistry').item('TenantMemberRole');

var Service = function(context){
    this.context = context;
};

/**
 * register platform user post
 * @param openid
 * @param role
 * @param callback
 */
Service.prototype.registerPlatformPost = function (openid, role, callback) {
    var self = this;
    var logger = this.context.logger;
    var platformTenantService = this.context.services.platformTenantService;
    var platformUserService = this.context.services.platformUserService;
    var platformUserKv = this.context.kvs.platformUser;
    co(function*() {
        var id = yield platformUserKv.loadIdByOpenidAsync(openid);
        var user = yield platformUserKv.loadByIdAsync(id);
        var updateOrAdd = 'add';
        var platform = yield platformTenantService.ensurePlatformAsync();
        if (user) {
            if (user.posts && user.posts.length > 0) {
                var hasOperationRole = false;
                var platformPost = null;
                user.posts.forEach(function (item) {
                    if (item.tenant == platform.id) {
                        platformPost = item;
                        return;
                    }
                })
                if (platformPost) {
                    if (platformPost.role == role) {
                        hasOperationRole = true;
                    }
                    else if (platformPost.role == TenantMemberRole.PlatformOperation.value() && role == TenantMemberRole.PlatformAdmin.value()) {
                        hasOperationRole = false;
                        updateOrAdd = 'update';
                    }
                    else {
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
            user = yield self.setPlatformUserPostsAsync(user, role, updateOrAdd);
            if (callback) callback(null, user);
        } else {
            user = yield platformUserService.createPlatformUserAsync(openid);
            user = yield self.setPlatformUserPostsAsync(user, role, updateOrAdd);
            if (callback) callback(null, user);
        }
    }).catch(Error, function (err) {
        logger.error('Fail to register platform user for openid '+openid+':' + err);
        if (callback) callback(err);
    });
};

/**
 * update platform user posts
 * @param user
 * @param role
 * @param updateOrAdd update existed post or add a new post value: 'update' or 'add'
 * @param callback
 */
Service.prototype.updatePlatformUserPosts = function(user, role, updateOrAdd, callback){
    var platformTenantService = this.context.services.platformTenantService;
    var tenantMemberService = this.context.services.tenantMemberService;
    var platformUserService = this.context.services.platformUserService;

    co(function*(){
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

        user = yield platformUserService.updateAsync(conditions, update);
        if(callback) callback(null, user);
    }).catch(Error, function (err) {
        logger.error('Fail to update platform user posts: ' + err);
        if (callback) callback(err);
    });
}

module.exports = Service;