var wechatUserService = require('../../user/services/WechatUserService');
var Promise = require('bluebird');

var ContextDecorator = function(){};
ContextDecorator.prototype.decorate = function(context){
    context.getUser = function(){
        if(!context._getUserThenable){
            var getUserAsync = Promise.promisify(wechatUserService.loadOrCreateFromWechat);
            context._getUserThenable = getUserAsync(context.weixin.FromUserName);
        }
        return context._getUserThenable;
    };
    context.invalidateUser = function(){
        context._getUserThenable = null;
    };
};

module.exports = ContextDecorator;