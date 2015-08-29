var cskv = require('./CustomerServer');
var redis = require('redis');
var wechatApi = require('../../wechat/common/api').api;

var MessageHandler = function(){
    this.redisClient = redis.createClient();
    this.redisClientInit();
}

var prototype  = MessageHandler.prototype;

prototype.redisClientInit = function(){
    var self = this;
    self.redisClient.subscribe('__keyevent@0__:expired');
    self.redisClient.on('message', self.handleRedisMessage.bind(self));
}

prototype.handleRedisMessage = function(channel, message){
    var key = message;
    var customer;
    console.log('handle expire');
    var prefix = key.slice(0, 6);
    console.log('prefix======'+ prefix);
    var csId = key.slice(6);
    if(prefix == 'cs:st:') {
        cskv.loadCSSByIdAsync(csId)
            .then(function(css){
                if(css) customer = css.initiator;
                return  cskv.delCSSByIdAsync(csId);
            })
            .then(function () {
                return cskv.remWcCSSetAsync(csId);
            })
            .then(function () {
                return cskv.saveCSStatusByCSOpenIdAsync(csId, 'off');
            })
            .then(function(){
                cskv.delWelcomeStatusAsync(customer);
            })
            .then(function(){
                wechatApi.sendText(csId, '[系统]:长时间无交互，您已下线', function(err, result){
                    console.log('[系统]:长时间无交互，您已下线 客服OpenId:' + csId);
                });
            })
            .catch(Error, function (err) {
                console.log('reset cs error');
                console.log(err);
            });
    }
}

module.exports = MessageHandler;