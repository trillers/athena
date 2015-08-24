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
var tokenConfig = productionMode ? {
    token: settings.wechat.token,
    appid: settings.wechat.appKey,
    encodingAESKey: settings.wechat.encodingAESKey
} : settings.wechat.token;
var thunkify = require("thunkify")
var WechatAuthenticator = require('../../framework/WechatAuthenticator');
var authenticator = new WechatAuthenticator({});
var authEnsureSignin = thunkify(authenticator.ensureSignin);
var customerDispatcher = require('../../modules/customer_server');
var frankon = new Frankon();

var ensureSignin = thunkify(authenticator.ensureSignin.bind(authenticator));

module.exports = function() {
    var router = new Router();
    //require('../common/routes-wechat')(router);

    //frankon.use(function* (next) {
    //    //根据角色，分别派遣session，然后next
    //    var user = yield authEnsureSignin(this.weixin, this.req, this.res, next)
    //    WechatOperationService.logActionAysnc(this.weixin);
    //    customerDispatcher.dispatch(user, this.weixin, res);
    //
    //});

    frankon.use(function* (next) {
        //根 据消息类型分别处理
        //如果是用户消息，先查进行中的会话，有就发送
        //没有就查询待处理列表，没有就新建或者有就发送消息

    });

    //var handler = function* (next) {
    //    //根据角色，分别派遣session，然后next
    //    var self = this;
    //    var message = self.weixin;
    //    try{
    //        var user = yield ensureSignin(message, self, next);
    //        console.log('+++++++++++++++++');
    //        console.log(user);
    //        console.log(message);
    //        WechatOperationService.logActionAsync(message);
    //        if(message.MsgType == 'event'){
    //            switch(message.Event.toLowerCase()){
    //                case 'subscribe':
    //                    yield QrChannelDispatcher.dispatch(message, user, self);
    //                    break;
    //                case 'unsubscribe':
    //                    //var update = {};
    //                    //update.wx_subscribe = 0;
    //                    self.body = '';
    //                    break;
    //                case 'location':
    //                    self.body = 'Hi! What can I do for you?';
    //                    break;
    //            }
    //
    //        }else{
    //            console.log('message');
    //            self.body = '';
    //            CSDispatcher.dispatch(user, message);
    //        }
    //    } catch (err){
    //        console.log('ensureSignin error:' + err);
    //    }
    //}

    var handler = frankon.generateHandler();
    var wechatMiddleware = wechat(tokenConfig).middleware(handler);
    router.all('/wechat', wechatMiddleware);
    return router.routes();
}