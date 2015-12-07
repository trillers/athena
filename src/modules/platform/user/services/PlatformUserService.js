var cbUtil = require('../../../../framework/callback');
//var WechatMediumUserType = require('../../../common/models/TypeRegistry').item('WechatMediumUserType');


var Service = function(context){
    this.context = context;
};

//TODO
//Service.prototype.createWechatSiteUser = function(wechatUserJson, callback) {
//    wechatUserJson.type = WechatMediumUserType.WechatSiteUser.value();
//    this.create(wechatUserJson, callback);
//};

Service.prototype.createPlatformUser = function(openid, callback) {
    /*

    user = kv.loadByOpenid(openid);
    if(user){
        return user;
    }
    else{
        var userInfo = wechatApi.getUser(openid);
        var userJson <-- userInfo;
        var user = this.create(userJson);
        var platformWechatSite = getPlatformWechatSite();

        userInfo.user = user.id;
        var wechatSiteUser = PlatformWechatSiteService.addUser(platformWechatSite.id, userInfo);
        return user;
    }

    */

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
                if(callback) callback(err, obj);
            });
        }, err, result, affected);
    });

};

module.exports = Service;