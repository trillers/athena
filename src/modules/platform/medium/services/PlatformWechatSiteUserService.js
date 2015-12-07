var util = require('util');
var cbUtil = require('../../../../framework/callback');
var WechatMediumUserType = require('../../../common/models/TypeRegistry').item('WechatMediumUserType');
var WechatMediumUserService = require('../../../medium/base/services/WechatMediumUserService');

var Service = function(context){
    this.context = context;
};

util.inherits(Service, WechatMediumUserService);

Service.prototype.createPlatformWechatSiteUser = function(mediumUserJson, callback){
    var logger = this.context.logger;
    var platformWechatSiteService = this.context.services.platformWechatSiteService;
    var me = this;
    platformWechatSiteService.ensurePlatformWechatSite(function(err, wechatSite){
        if(err){
            logger.error('Fail to ensure platform wechat site: ' + err);
            if(callback) callback(err);
            return;
        }
        mediumUserJson.host = wechatSite.id;
        mediumUserJson.type = WechatMediumUserType.WechatSiteUser.value();
        me.create(mediumUserJson, callback);
    });
};


module.exports = Service;