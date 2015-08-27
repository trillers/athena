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
var cskv = require('../../modules/customer_server/kvs/CustomerServer');
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
        var user = yield ensureSignin(message, self, next);
        this["wxUser"] = user;
        WechatOperationService.logActionAsync(message);
        yield next;
    });

    frankon.use(require('../../modules/wechat/middlewares/user-heartbeat'));

    frankon.use(function* (next) {
    //根据角色，分别派遣session，然后next
        var self = this;
        var user = this.wxUser;
        var message = self.weixin;
        try{
            if(message.MsgType == 'event'){
                switch(message.Event.toLowerCase()){
                    case 'subscribe':
                        yield QrChannelDispatcher.dispatch(message, user, self);
                        break;
                    case 'unsubscribe':
                        //var update = {};
                        //update.wx_subscribe = 0;
                        self.body = '';
                        break;
                    case 'location':
                        console.log(message);
                        var welcomeStatus = yield cskv.loadWelcomeStatusAsync(user.wx_openid);
                        if(welcomeStatus == 'true' || user.role == 'cs'){
                            self.body = '';
                        }else{
                            self.body = 'welcome Dear! What can I do for you?';
                            yield cskv.saveWelcomeStatusAsync(user.wx_openid, true);
                            var location = {
                                user: user.wx_openid,
                                latitude: message.Latitude,
                                longitude: message.Longitude
                            }
                            var url = settings.txLocationServer.host + '?location=' + location.latitude + ',' + location.longitude + '&key=' +settings.txLocationServer.key;
                            request(url, function (error, response, body) {
                                if (!error && response.statusCode == 200) {
                                    var locationInfo = JSON.parse(body);
                                    location.address = locationInfo.result.address;
                                    location.formatted_address = locationInfo.result.formatted_addresses.recommend;
                                    UserLocationService.create(location, function(err, doc){
                                        //TODO
                                    })
                                }
                            })
                        }
                        break;
                }

            }else{
                self.body = 'success';
                console.log('================');
                console.log('common message');
                console.log(message);
                CSDispatcher.dispatch(user, message);
            }
        } catch (err){
            console.log('error:' + err);
        }
    });

    var handler = frankon.generateHandler();
    var wechatMiddleware = wechat(tokenConfig).middleware(handler);
    router.all('/wechat', wechatMiddleware);
    return router.routes();
}