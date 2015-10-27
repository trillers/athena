var WechatBotManager = require('../wechat-bot/services/WechatBotManager');
var wechatApi = require('../wechat/common/api').api;
var logger = require('../../app/logging').logger;
var WechatBotProxy = require('../wechat-bot/proxy/WechatBotProxy');
var wechatBotUserService = require('../user/services/WechatBotUserService');
var botManager = new WechatBotManager();

botManager.on('init', function(botInfos){
    if(botInfos && botInfos.length){
        botInfos.forEach(function(botInfo){
            logger.info('Wechat bot ' + botManager._encodeBotid(botInfo) + ' starting...');
            botManager.start(botInfo);
        });
    }
});

botManager.on('register', function(msg){
    botManager.start(msg);
});

botManager.on('need-login', function(msg){
    var url = 'http://ci.www.wenode.org/api/file?media_id=' + msg.media_id;
    //TODO use variables to make url
    //TODO generate wechat media id;
console.log(url);
    wechatApi.sendText(msg.openid, url, function(err, result){
        if(err){
            logger.error('Fail to send wechat bot login qrcode: ' + err);
        }
        else{
            logger.info('Succeed to send wechat bot login qrcode of ' + msg.openid + ' of ' + msg.bucketid );
        }
    });
});

botManager.on('contact-added', function(contact){
    console.error('contact');
    console.error(contact);
    wechatBotUserService.createFromContact(contact, function(err, userJson){
        console.error(userJson);
        botManager.requestProfile(contact, contact.bid);
    })
});

botManager.on('profile', function(profile){
    wechatBotUserService.updateFromProfile(profile.bid, profile, function(err, userJson){
        console.warn(userJson);
    })
});

botManager.on('message', function(msg){
    console.info('new message is coming');
    console.info(msg);
});

setTimeout(function(){
    botManager.proxy.init();
    botManager.init();
}, 2000);

module.exports = botManager;