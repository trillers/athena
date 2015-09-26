var WechatUserService = require('./WechatUserService');
var logger = require('../../../app/logging').logger;

var defaults = {
    userKey: 'user' //wxsession key of user info
};
var _extend = function(target, source){
    for (var key in source) {
        target[key] = source[key];
    }
};
var Authenticator = function(options){
    _extend(this, defaults);
    _extend(this, options||{});
};

Authenticator.prototype = {
    authenticated: function(ctx){
        var user = ctx.wxsession && ctx.wxsession[this.userKey];
        return user;
    },

    clearAuthentication: function(ctx){
        ctx.wxsession && ctx.wxsession.destroy();
    },

    setAuthentication: function(ctx, user){
        ctx.wxsession && (ctx.wxsession[this.userKey] = user);
    },

    ensureSignin: function(message, ctx, callback){
        var user = this.authenticated(ctx);
        if(user){
            callback(null, user);
        }
        else{
            this.loadOrCreateWechatUser(message, ctx, callback);
        }
    },

    loadOrCreateWechatUser: function(message, ctx, callback){
        var me = this;
        WechatUserService.loadOrCreateFromWechat(message.FromUserName, function(err, user){
            if(err){
                logger.error('Fail to sign in from wechat: ' + err);
                callback(err);
            }
            else{
                me.setAuthentication(ctx, user);
                console.error(user);
                callback(null, user);
            }
        });
    }
};

module.exports = Authenticator;