var WechatOAuth = require('wechat-oauth');
var Promise = require('bluebird');
var util = require('util');
var logger = require('../app/logging').logger;
var request = require('request');
var scopes = require('../modules/wechat').oauth.scopes;
var languages = require('../modules/wechat').oauth.languages;
var errorUtil = require('../modules/wechat').error;

var defaultConfig = {
    appKey: '', //the client id in oauth2, which needs to be applied from service provider
    appSecret: '', //the client secret in oauth2, which needs to be applied from service provider
    getAT: null, //
    saveAT: null,//
    state: 'seed',
    scope: scopes.userinfo,
    redirectUrl: ''//the client side url which is used to return after logout from service provider side
};

var _extend = function (target, source) {
    for (var key in source) {
        target[key] = source[key];
    }
    return target;
};

var generateRequestUserAsync = function(client){
    var fn = function(openid, callback){
        var options = {
            openid: openid,
            lang: languages.zh_CN
        };
        client.getUser(options, function(err, result){
            if(err){
                if(callback) callback(err);
            }
            else{
                if(callback) callback(null, result);
            }
        });
    };
    return Promise.promisify(fn);
};

/**
 *
 * @param options
 *  appKey
 *  appSecret
 *  getAccessToken
 *  saveAccessToken
 *  redirectUrl
 *  state
 *  scope snsapi_userinfo
 * @constructor
 */
var WeixinOAuthClient = function (options) {
    options = options || {};
    _extend(this, options);
    if(this.getAT && this.saveAT){
        this.wo = new WechatOAuth(this.appKey,this.appSecret, this.getAT, this.saveAT);
    }
    else{
        this.wo = new WechatOAuth(this.appKey,this.appSecret);
    }
    Promise.promisifyAll(this.wo);
    this.wo.requestUserAsync = generateRequestUserAsync(this.wo);
};

_extend(WeixinOAuthClient.prototype, defaultConfig);

WeixinOAuthClient.prototype.getAuthorizeUrl = function () {
    if(!this.authorizeUrl){
        this.authorizeUrl = this.wo.getAuthorizeURL(this.redirectUrl, this.state, this.scope);
    }
    return this.authorizeUrl;
};

WeixinOAuthClient.prototype.getAuthorizationCode = function (req, res, next) {
    res.writeHead(303, {Location: this.getAuthorizeUrl()});
    res.end();
};

WeixinOAuthClient.prototype.exchangeAccessToken = function (req, res, next) {
    var state = req.query.state;
    var code = req.query.code;
    var client = this.wo;
    if(this.state!=state){
        res.render('error', {error: new Error('Wechat oauth exchange access token: echo state is different')});
        return;
    }

    client.getAccessTokenAsync(code)
        .then(function(result){
            errorUtil.throwResultError(result, 'getAccessToken');
            req.oauth = result.data;
            return req.oauth;
        })
        .then(function(oauth){
            if(scopes.base==oauth.scope){

            }
            else if(scopes.userinfo==oauth.scope){
                return client.requestUserAsync(oauth.openid);
            }
            else{
                throw new Error('Illegal scope return: ' + JSON.stringify(oauth));
            }
        })
        .then(function(result){
            errorUtil.throwResultError(result, 'getUser');
            if(req.oauth != result){
                _extend(req.oauth, result);
            }
            next();
            return req.oauth;
        })
        .catch(Error, function(err){
            logger.error('Fail to signup or signin with wechat oauth: ' + err);
            res.render('error', {error: err});
        });
};

WeixinOAuthClient.prototype.logout = function (res) {};

module.exports = WeixinOAuthClient;
