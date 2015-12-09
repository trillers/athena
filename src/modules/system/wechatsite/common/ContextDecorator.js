var platformUserService = require('../../../../').services.platformUserService;

var ContextDecorator = function(){};
ContextDecorator.prototype.decorate = function(context){
    context.getUser = function(){
        if(!context._getUserThenable){
            var getUserAsync = platformUserService.loadPlatformUserByOpenidAsync;
            context._getUserThenable = getUserAsync(context.weixin.FromUserName);
        }
        return context._getUserThenable;
    };
    context.invalidateUser = function(){
        context._getUserThenable = null;
    };
};
module.exports = ContextDecorator;