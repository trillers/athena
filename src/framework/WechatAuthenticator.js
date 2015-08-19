var UserService = require('../modules/user/services/UserService');
var logger = require('../app/logging').logger;

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

    ensureSignin: function(message, ctx, next, done){
        //var user = this.authenticated(ctx);
        //console.log('has user');
        //console.log(user);
        //if(user){
        //    done(null, user);
        //}
        //else{
            this.loadOrCreateWechatUser(message, ctx, next, done);
        //}
    },

    loadOrCreateWechatUser: function(message, ctx, next, done){
        var me = this;
        UserService.loadOrCreateFromWechat(message.FromUserName, function(err, user){
            if(err){
                logger.error('Fail to sign in from wechat: ' + err);
                if(next) next();//TODO: do more error handling than this
            }
            else{
                me.setAuthentication(ctx, user);
                done(null, user);
            }
        });
    }
};

module.exports = Authenticator;