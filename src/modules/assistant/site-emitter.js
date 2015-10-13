var WechatEmitter = require('../../framework/WechatEmitter');
var wechatEmitter = new WechatEmitter();

var wechatUserService = require('../user/services/WechatUserService');
var Promise = require('bluebird');
var ContextDecorator = function(){};
//ContextDecorator.prototype.decorate = function(context){
//    context.user = null;
//    context.getUser = Promise.promisify(wechatUserService.loadOrCreateFromWechat);
//};
//var decorator = new ContextDecorator();
//wechatEmitter.setContextDecorator(decorator);

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
var decorator = new ContextDecorator();
wechatEmitter.setContextDecorator(decorator);



require('./handlers/AssistantEventHandler')(wechatEmitter);
require('./handlers/AssistantMessageHandler')(wechatEmitter);
require('../../modules/wechat/handlers/WechatOperationHandler')(wechatEmitter);

module.exports = wechatEmitter;