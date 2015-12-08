var Promise = require('bluebird');
var wechatUserService = require('../../../user/services/WechatUserService');
var context = require('../../../../');

var ContextDecorator = function(){};

//var platformUserService = context.services.platformUserService;
var getUserAsync = Promise.promisify(wechatUserService.loadOrCreateFromWechat);

ContextDecorator.prototype.decorate = function(context){
    context.getUser = function(){
        if(!context._getUserThenable){
            context._getUserThenable = getUserAsync(context.weixin.FromUserName);
        }
        return context._getUserThenable;
    };
    context.invalidateUser = function(){
        context._getUserThenable = null;
    };
};

module.exports = ContextDecorator;