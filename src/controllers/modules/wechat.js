var settings = require('athena-settings');
var Frankon = require('../../framework/frankon');
var Router = require('koa-router');
var co = require('co');
var wechat = require('co-wechat');
var WechatOperationService = require('../../modules/wechat/services/WechatOperationService');
var QrChannelDispatcher = require('../../modules/qrchannel');
var UserKv = require('../../modules/user/kvs/User');
var CSDispatcher = require('../../modules/customer_server');
var productionMode = settings.env.mode == 'production';
var logger = require('../../app/logging').logger;
var cskv = require('../../modules/customer_server/kvs/CustomerService');
var request = require('request');
var UserLocationService = require('../../modules/location/services/UserLocationService');
var tokenConfig = productionMode ? {
    token: settings.wechat.token,
    appid: settings.wechat.appKey,
    encodingAESKey: settings.wechat.encodingAESKey
} : settings.wechat.token;
var thunkify = require("thunkify");
var WechatAuthenticator = require('../../framework/WechatAuthenticator');
var authenticator = new WechatAuthenticator({});
var authEnsureSignin = thunkify(authenticator.ensureSignin);
var customerDispatcher = require('../../modules/customer_server');
var frankon = new Frankon();
var notificationCenter = require('../../framework/NotificationCenter')

var ensureSignin = thunkify(authenticator.ensureSignin.bind(authenticator));

module.exports = function() {
    var router = new Router();
    //require('../common/routes-wechat')(router);

    frankon.use(function* (next) {
        var self = this;
        var message = self.weixin;
        console.log('message');
        console.log(message);
        //var user = yield ensureSignin(message, self, next);
        //this["user"] = user;
        //WechatOperationService.logActionAsync(message);
        yield next;
    });

    frankon.use(require('../../modules/wechat/middlewares/user-heartbeat'));
    var emitter = require('../../modules/assistant/site-emitter');
    frankon.use(function* (next) {
        emitter.relay(this);
        this.body = '';
    });

    var handler = frankon.generateHandler();
    var wechatMiddleware = wechat(tokenConfig).middleware(handler);
    router.all('/wechat', wechatMiddleware);
    return router.routes();
}