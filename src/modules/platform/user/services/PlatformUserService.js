var co = require('co');
var cbUtil = require('../../../../framework/callback');
var WechatMediumUserType = require('../../../common/models/TypeRegistry').item('WechatMediumUserType');
var wechat = require('../../../wechat/common/api');
var helper = require('../../../wechat/common/helper');

var Service = function(context){
    this.context = context;
};

Service.prototype.createPlatformUser = function(openid, callback) {
    var logger = this.context.logger;
    var kv = this.context.kvs.platformUser;
    var platformWechatSiteService = this.context.services.platformWechatSiteService;
    var platformWechatSiteUserService = this.context.services.platformWechatSiteUserService;
    var me = this;

    co(function* (){
        var userId = yield kv.loadIdByOpenidAsync(openid);
        var user = yield kv.loadByIdAsync(userId);
        if(user){
            if(callback) callback(null, user);
            return;
        }

        var wechatSiteUserInfo = yield helper.getUserInfoAsync(wechat.api, openid, 'zh_CN');
        var userJson = {posts: []};
        helper.copyUserInfo(userJson, wechatSiteUserInfo);
        user = yield me.createAsync(userJson);
        var wechatSite = yield platformWechatSiteService.ensurePlatformWechatSiteAsync();
        var wechatSiteUserJson = {};
        wechatSiteUserJson.host = wechatSite.id;
        wechatSiteUserJson.type = WechatMediumUserType.WechatSiteUser.value();
        wechatSiteUserJson.user = user.id;
        helper.copyUserInfo(wechatSiteUserJson, wechatSiteUserInfo);
        platformWechatSiteUserService.createPlatformWechatSiteUser(wechatSiteUserJson);
        if(callback) callback(null, user);
    }).catch(Error, function(err){
        logger.error('Fail to create platform user: ' + err);
        logger.error(err.stack);
        if(callback) callback(err);
    });
};


Service.prototype.create = function(userJson, callback){
    var logger = this.context.logger;
    var kv = this.context.kvs.platformUser;
    var PlatformUser = this.context.models.PlatformUser;
    var user = new PlatformUser(userJson);
    user.save(function (err, result, affected) {
        cbUtil.logCallback(
            err,
            'Fail to save platform user: ' + err,
            'Succeed to save platform user');

        cbUtil.handleAffected(function(err, doc){
            var obj = doc.toObject({virtuals: true});
            kv.saveById(obj, function(err, obj){
                if(err){
                    //TODO
                    if(callback) callback(err);
                    return;
                }
                kv.linkOpenid(obj.openid, obj.id, function(err){
                    if(callback) callback(err, obj);
                });
            });
        }, err, result, affected);
    });

};

Service.prototype.update = function(conditions, update, callback){
    var PlatformUser = this.context.models.PlatformUser;
    var kv = this.context.kvs.platformUser;
    PlatformUser.findOneAndUpdate(conditions, update, {new: true}, function(err, doc){
        cbUtil.logCallback(
            err,
            'Fail to update platform user: ' + err,
            'Succeed to update platform user');

        cbUtil.handleSingleValue(function(err, doc){
            var obj = doc.toObject({virtuals: true});
            kv.saveById(obj, function(err, obj){
                if(err){
                    //TODO
                    if(callback) callback(err);
                    return;
                }
                obj.posts = JSON.parse(obj.posts);
                if(callback) callback(err, obj);
                return ;
            });
        }, err, doc);
    })
}

module.exports = Service;