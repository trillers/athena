var logger = require('../app/logging').logger;

var _extend = function(target, source){
    for (var key in source) {
        target[key] = source[key];
    }
};
var defaults = {
    userKey: 'user', //session key of user info
    tokenKey: 'token', //cookie key of user authentication token
    authenticator: null // Authenticator which is used to sign up, sign in and sign out
};

var Authenticator = function(options){
    _extend(this, defaults);
    _extend(this, options||{});
};

Authenticator.prototype = {
    authenticated: function(req, res){
        var user = req.session && req.session[this.userKey];
        var token = req.cookies[this.tokenKey];
        if(user && !token){
            res.cookie(this.tokenKey, user.token, {maxAge: 3600000*24*366}); //TODO
        }
        return user && req.session.authenticated;
    },

    filter: function(req, res, next){
        if(this.authenticated(req, res)){
            next();
        }
        else{
            this.authenticator.signUpOrInAnonymously(req, res, next);
        }
    },

    genFilter: function(){
        return this.filter.bind(this);
    }
};

module.exports = Authenticator;