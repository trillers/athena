var UserService = require('../modules/user/services/UserService');
var logger = require('../app/logging').logger;

var _extend = function(target, source){
    for (var key in source) {
        target[key] = source[key];
    }
    return target;
};
var defaults = {
    userKey: 'user', //session name of user info objectuser's key name in session
    tokenKey: 'token' //cookie name of user authentication token
};

var Authenticator = function(options){
    _extend(this, defaults);
    _extend(this, options||{});
};

Authenticator.prototype = {
    setAuthentication: function(req, res, user){
        res.cookie(this.tokenKey, user.token, {maxAge: 3600000*24*366}); //TODO
        req.session[this.userKey] = user;
        req.session.authenticated = user.stt == 'r';
        return user;
    },

    afterLogin: function(user, next){
        next();
    },

    signUpOrInAnonymously: function(req, res, next){
        var token = req.cookies[this.tokenKey];
        var auth = this;
        var promise = null;
        if(!token){
            promise = UserService.createAnonymously();
        }
        else{
            promise = UserService.loadByToken(token)
                .then(function(user){
                    return user || UserService.createAnonymously();
                });
        }

        promise
            .then(function(user){
                var userInfo = auth.setAuthentication(req, res, user);
                auth.afterLogin(userInfo, function(){
                    next();
                });
                return user;
            })
            .catch(Error, function(err){
                logger.error('Fail to signup or signin anonymously: ' + err);
                next();
            });
    }
};

module.exports = Authenticator;