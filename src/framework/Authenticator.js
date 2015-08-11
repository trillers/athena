var UserService = require('../modules/user/services/UserService');
var WechatUserService = require('../modules/user/services/WechatUserService');
var logger = require('../app/logging').logger;

var _extend = function(target, source){
    for (var key in source) {
        target[key] = source[key];
    }
    return target;
};
var defaults = {
    userKey: 'user', //session key of user info
    tokenKey: 'token', //cookie key of user authentication token
    agentKey: 'agent', ////cookie key of agent flags of authentication
    returnUrlKey: 'returnUrl', //session key of return url in session
    defaultReturnUrl: '/',
    callbackUri: '/auth/callback',
    signinUri: '/auth/signin',
    signoutUri: '/auth/signout',
    oauthClient: null //oauth client which need to be injected
};

var Authenticator = function(options){
    _extend(this, defaults);
    _extend(this, options||{});
};

Authenticator.prototype = {
    clearAuthentication: function(req, res){
        req.session && req.session.destroy();

        /*
         * TODO: set agent a flag to do not signin automatically
         *  but I don't code the flag logic
         */
        res.cookie(this.agentKey, '1', {maxAge: 3600000*24*366});
    },

    setAuthentication: function(req, res, userJson){
        res.cookie(this.tokenKey, userJson.token, {maxAge: 3600000*24*366}); //TODO
        req.session.authenticated = true;
        req.session[this.userKey] = userJson;
        return userJson;
    },

    redirectReturnUrl: function(req, res){
        var returnUrl = req.session[this.returnUrlKey];
        if(returnUrl){
            req.session[this.returnUrlKey] = null;
        }
        else{
            returnUrl = this.defaultReturnUrl;
        }
        logger.warn('redirect to return url: ' + returnUrl);
        res.redirect(returnUrl);
    },

    signin: function(req, res, next){
        this.oauthAuthorize(req, res, next);
    },

    signout: function(req, res, next){
        this.clearAuthentication(req, res);
        res.redirect(this.defaultReturnUrl);
    },

    oauthAuthorize: function(req, res, next){
        this.oauthClient.getAuthorizationCode(req, res, next);
    },

    oauthCallback: function(req, res, next){
        this.oauthClient.exchangeAccessToken(req, res, next);
    },

    afterLogin: function(userJson, next){
        next();
    },

    signUpOrIn: function(req, res, next){
        var oauth = req.oauth;
        var authenticator = this;
        if(!oauth){
            logger.error('Fail to pass oauth authorization flow');
            res.render('error', {error: new Error('Fail to pass oauth authorization flow')});
            return;
        }

        return WechatUserService.createOrUpdateFromWechatOAuth(oauth)
            .then(function(userJson){
                var userInfo = authenticator.setAuthentication(req, res, userJson);
                authenticator.afterLogin(userInfo, function(){
                    authenticator.redirectReturnUrl(req, res);
                });
                return userJson;
            })
            .catch(Error, function(err){
                logger.error('Fail to signup or signin with wechat oauth: ' + err);
                res.render('error', {error: err});
            });
    }
};

module.exports = Authenticator;