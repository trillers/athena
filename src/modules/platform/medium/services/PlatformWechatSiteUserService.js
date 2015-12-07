var util = require('util');
var cbUtil = require('../../../../framework/callback');
//var WechatMediumType = require('../../../common/models/TypeRegistry').item('WechatMediumType');
var WechatMediumUserService = require('../../../medium/base/services/WechatMediumUserService');

var Service = function(context){
    this.context = context;
};

util.inherits(Service, WechatMediumUserService);

Service.prototype.createPlatformWechatSiteUser = function(mediumUserJson, userId, callback){
    var logger = this.context.logger;
    var me = this;
    this.ensurePlatformWechatSite(function(err, wechatSite){
        if(err){
            logger.error('Fail to ensure platform wechat site: ' + err);
            if(callback) callback(err);
            return;
        }
        mediumUserJson.host = wechatSite.id;
        userId && (mediumUserJson.user = userId);
        me.create(mediumUserJson, callback);
    });
};


module.exports = Service;