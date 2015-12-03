var util = require('util');
var cbUtil = require('../../../../framework/callback');
var settings = require('athena-settings');
var WechatMediumType = require('../../../common/models/TypeRegistry').item('WechatMediumType');
var WechatMediumService = require('../../base/services/WechatMediumService');

var Service = function(context){
    this.context = context;
};

util.inherits(Service, WechatMediumService);

//TODO:  mock implementation
Service.prototype.loadPlatformWechatSite = function(callback){
    var platformWechatSite = {
        _id: '001'
        , lFlg: 'a'
        , crtOn: new Date()
        , tenant: '001' //TODO
        , type: WechatMediumType.WechatSite.value()
        , originalId: settings.wechat.siteId
        , customId: ''
        , name: settings.wechat.siteName
        , headimgurl: 'http://mp.weixin.qq.com/mp/qrcode?scene=10000005&size=102&__biz=MzAxNDAwNTUyMg=='
        , qrcodeurl: 'http://mp.weixin.qq.com/mp/qrcode?scene=10000005&size=102&__biz=MzAxNDAwNTUyMg=='
        , appId:        settings.wechat.appKey
        , appSecret:    settings.wechat.appSecret

    };
    if(callback) callback(null, platformWechatSite);
};

Service.prototype.createPlatformWechatSite = function(callback){
    var platformTenantService = this.context.services.platformTenantService;
    var platformWechatSite = {
        type: WechatMediumType.WechatSite.value()
        , originalId: settings.wechat.siteId
        , name: settings.wechat.siteName
        , headimgurl: 'http://mp.weixin.qq.com/mp/qrcode?scene=10000005&size=102&__biz=MzAxNDAwNTUyMg=='
        , qrcodeurl: 'http://mp.weixin.qq.com/mp/qrcode?scene=10000005&size=102&__biz=MzAxNDAwNTUyMg=='
        , appId:        settings.wechat.appKey
        , appSecret:    settings.wechat.appSecret
    };

    platformTenantService.loadPlatform(function(err, platform){
        if(err){
            //TODO
            if(callback) callback(err);
            return;
        }
        else if(!platform){
            //TODO
            if(callback) callback(err);
            return;
        }
        platformWechatSite.tenant = platform.id;
        this.create(platformWechatSite, callback);
    });

};

module.exports = Service;