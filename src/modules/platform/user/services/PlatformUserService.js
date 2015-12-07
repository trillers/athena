var cbUtil = require('../../../../framework/callback');
//var WechatMediumUserType = require('../../../common/models/TypeRegistry').item('WechatMediumUserType');
var wechat = require('../../../wechat/common/api');

var Service = function(context){
    this.context = context;
};

var getUserFromWechat = function (openid, callback) {
    var input = {openid: openid, lang: 'zh_CN'}
    wechat.api.getUser(input, function (err, userInfo) {
        if (err) {
            if (callback) callback(err);
        }
        else {
            if (callback) callback(null, userInfo);
        }
    });
};

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
    var logger = this.context.logger;
    var kv = this.context.kvs.platformUser;
    var platformWechatSiteService = this.context.services.platformWechatSiteService;
    var platformWechatSiteUserService = this.context.services.platformWechatSiteUserService;

    var me = this;
    kv.loadIdByOpenid(openid, function(err, id){
        if(err){
            //TODO logging
            logger.error(err);
            logger.error(err.stack);
            if(callback) callback(err);
            return;
        }

        if(id){
            kv.loadById(id, callback);
        }
        else{
            getUserFromWechat(openid, function(err, wechatSiteUserInfo){
                if(err){
                    //TODO logging
                    logger.error(err);
                    logger.error(err.stack);
                    if(callback) callback(err);
                    return;
                }

                var userJson = {
                    posts: []
                    , openid:       openid
                    , nickname:     wechatSiteUserInfo.nickname
                    , headimgurl:   wechatSiteUserInfo.headimgurl
                    , sex:          wechatSiteUserInfo.sex
                };

                var  directCities = {
                    '北京': true,
                    '天津': true,
                    '上海': true,
                    '重庆': true
                };

                //TODO
                if(directCities){
                    userJson.country = wechatSiteUserInfo.country;
                    userJson.province = wechatSiteUserInfo.province;
                    userJson.city = wechatSiteUserInfo.city;
                    userJson.district = wechatSiteUserInfo.district;
                }

                me.create(userJson, function(err, user){
                    if(err){
                        //TODO logging
                        logger.error(err);
                        logger.error(err.stack);
                        if(callback) callback(err);
                        return;
                    }
                    var userId = user.id;
                    platformWechatSiteService.ensurePlatformWechatSite(function(err, wechatSite){
                        if(err){
                            //TODO logging
                            logger.error(err);
                            logger.error(err.stack);
                            if(callback) callback(err);
                            return;
                        }

                        var wechatSiteUserJson = {
                            openid:       openid
                            , nickname:     wechatSiteUserInfo.nickname
                            , headimgurl:   wechatSiteUserInfo.headimgurl
                            , sex:          wechatSiteUserInfo.sex

                            , language:          wechatSiteUserInfo.language
                            , remark:          wechatSiteUserInfo.remark
                        };
                        wechatSiteUserJson.host = wechatSite.id;
                        wechatSiteUserJson.type = WechatMediumUserType.WechatSiteUser.value();

                        //TODO
                        if(directCities){
                            wechatSiteUserJson.country = wechatSiteUserInfo.country;
                            wechatSiteUserJson.province = wechatSiteUserInfo.province;
                            wechatSiteUserJson.city = wechatSiteUserInfo.city;
                            wechatSiteUserJson.district = wechatSiteUserInfo.district;
                        }

                        platformWechatSiteUserService.createPlatformWechatSiteUser(wechatSiteUserJson, userId, function(err, wechatSiteUser){
                            if(err){
                                //TODO logging
                                logger.error(err);
                                logger.error(err.stack);
                                if(callback) callback(err);
                                return;
                            }
                            if(callback) callback(null, user);

                        });
                    })

                });


            });


        }
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
                if(callback) callback(err, obj);
            });
        }, err, result, affected);
    });

};

Service.prototype.update = function(conditions, update, callback){
    var PlatformUser = this.context.models.PlatformUser;
    PlatformUser.findOneAndUpdate(conditions, update, {new: true}, function(err, doc){
        cbUtil.logCallback(
            err,
            'Fail to update platform user: ' + err,
            'Succeed to update platform user');

        cbUtil.handleSingleValue(callback, err, doc);
    })
}

module.exports = Service;