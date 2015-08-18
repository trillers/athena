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
    authenticated: function(req){
        var user = req.wxsession && req.wxsession[this.userKey];
        return user;
    },

    clearAuthentication: function(req, res){
        req.wxsession && req.wxsession.destroy();
    },

    setAuthentication: function(req, res, user){
        console.log('no error');
        console.log(req.wxsession);
        console.log(this.userKey);
        req.wxsession && (req.wxsession[this.userKey] = user);
    },

    ensureSignin: function(message, req, res, next, done){
        console.log('test');
        console.log(this);
        var user = this.authenticated(req);
        if(user){
            done(user);
        }
        else{
            this.loadOrCreateWechatUser(message, req, res, next, done);
        }
    },

    loadOrCreateWechatUser: function(message, req, res, next, done){
        var me = this;
        console.log('msg info');
        console.log(message);
        UserService.loadOrCreateFromWechat(message.FromUserName, function(err, user){
            if(err){
                logger.error('Fail to sign in from wechat: ' + err);
                //next();//TODO: do more error handling than this
            }
            else{
                console.log('no error');
                console.log(user);
                me.setAuthentication(req, res, user);
                console.log('excute done');
                console.log(done.toString());
                done(null, user);
            }
        });
    }
};

module.exports = Authenticator;