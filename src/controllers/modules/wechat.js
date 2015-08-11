var settings = require('pallas-settings');
var frankon = require('../../framework/frankon');
var express = require('express');
var co = require('co');
var service = require('../../services/UserService');
var wechat = require('co-wechat');
var WechatOperationService = require('../../services/WechatOperationService');
var QrChannelDispatcher = require('../../modules/qrchannel');
var UserKv = require('../../kvs/User');
var CSDispatcher = require('../../modules/customer_server');
var productionMode = settings.env.mode == 'production';
var logger = require('../../app/logging').logger;
var tokenConfig = productionMode ? {
    token: settings.wechat.token,
    appid: settings.wechat.appKey,
    encodingAESKey: settings.wechat.encodingAESKey
} : settings.wechat.token;

var WechatAuthenticator = require('../../framework/WechatAuthenticator');
var authenticator = new WechatAuthenticator({});
var authEnsureSignin = thunkify(authenticator.ensureSignin);
module.exports = function(){
    var router = express.Router({strict: false});
    require('../common/routes-wechat')(router);

    frankon.use(function(req, res, next){
        co(function* (){
            var user = yield authEnsureSignin(req.weixin, req, res, next)
            WechatOperationService.logAction(req.weixin);
            res.reply('欢迎来到快乐种子！');
        });
    });

    var handler = frankon.generateHandler();
    var wechatMiddleware = wechat(tokenConfig).middlewarify(handler);
    router.use(wechatMiddleware);
    return router;
};