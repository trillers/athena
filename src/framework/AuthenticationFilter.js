var logger = require('../app/logging').logger;
var settings = require('athena-settings');

var _extend = function(target, source){
    for (var key in source) {
        target[key] = source[key];
    }
};
var defaults = {
    userKey: 'user', //session key of user info
    tokenKey: 'token', //cookie key of user authentication token
    returnUrlKey: 'returnUrl', //session key of return url in session
    signinUri: '/auth/signin',
    context: '/' //context path of the app
};

var AuthenticatonFilter = function(options){
    _extend(this, defaults);
    _extend(this, options||{});
};

AuthenticatonFilter.prototype = {
    authenticated: function(req){
        var user = req.session && req.session[this.userKey];
        //var ok = user && user.stt == 'r';//UserState.Registered;

        /**
         * If property stt is "r" which means formally registered user, and
         * session variable authenticated is true, treat the user as authenticated
         * and let the user go in.
         */
        var ok = user && user.stt == 'r' && user.displayName != '匿名' && req.session.authenticated;

        /*
         * If a user browser is PC browser, treat the user as formal user
         * and let the user go in.
         * This workaround is mainly to support web crawling and developer testing.
         */
        var mobile = req.browser && req.browser.Mobile;
        ok = ok || !mobile || settings.env.name=='dev';

        return ok;
    },

    saveReturnUrl: function(req){
        var returnUrl = req.protocol + '://' + req.get('host') + (this.context=='/' ? '' : this.context) + req.originalUrl;
        req.session && (req.session[this.returnUrlKey] = returnUrl);
        logger.debug('save return url to session: ' + returnUrl);
    },

    signin: function(req, res, next){
        res.redirect(this.signinUri); //TODO: need to use https scheme
    },

    filter: function(req, res, next){
        if(this.authenticated(req)){
            next();
        }
        else{
            this.saveReturnUrl(req);
            this.signin(req, res, next);
        }
    },

    genFilter: function(){
        return this.filter.bind(this);
    }
};

module.exports = AuthenticatonFilter;