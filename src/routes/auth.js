var settings = require('athena-settings');
var Authenticator = require('../framework/Authenticator');
var WeixinOAuthClient = require('../framework/WeixinOAuthClient');
var UserKV = require('../modules/user/kvs/User');
var WebHelper = require('../app/web');
var scopes = require('../modules/wechat/common/oauth').scopes;

module.exports = function(app){
    var express = require('express');
    var router = express.Router({strict: true});
    require('../app/routes-page')(router);

    var weixinOAuthClient = new WeixinOAuthClient({
        appKey: settings.wechat.appKey,
        appSecret: settings.wechat.appSecret,
        getAccessToken: UserKV.getAccessToken,
        saveAccessToken: UserKV.saveAccessToken,
        state: 'seed',
        scope: scopes.userinfo,
        redirectUrl: WebHelper.getBaseUrl(settings.app) + '/auth/callback'
    });

    var auth = new Authenticator({
        defaultReturnUrl: '/',
        signinUri: '/auth/signin',
        callbackUri: '/auth/callback',
        signoutUri: '/auth/signout',
        oauthClient: weixinOAuthClient //oauth client which need to be injected
    });

    router.get(auth.signinUri, auth.signin.bind(auth));
    router.get(auth.signoutUri, auth.signout.bind(auth));
    router.get(auth.callbackUri, auth.oauthCallback.bind(auth), auth.signUpOrIn.bind(auth));

    app.use(router);
};