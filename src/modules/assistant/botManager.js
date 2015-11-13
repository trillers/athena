var WechatBotManager = require('../wechat-bot/services/WechatBotManager');
var wechatApi = require('../wechat/common/api').api;
var logger = require('../../app/logging').logger;
var WechatBotProxy = require('../wechat-bot/proxy/WechatBotProxy');
var wechatBotUserService = require('../user/services/WechatBotUserService');
var wechatBotGroupService = require('../wechat-bot/services/WechatBotGroupService');

var customerBotHandler = require('../customer/handlers/customerBotHandler');
var botManager = new WechatBotManager();

botManager.on('init', function(botInfos){
    if(botInfos && botInfos.length){
        botInfos.forEach(function(botInfo){
            var botid = botManager._encodeBotid(botInfo);
            logger.info('Wechat bot ' + botid + ' starting...');
            botManager.start(botInfo);
        });
    }
});

botManager.on('register', function(msg){
    botManager.start(msg);
});

botManager.on('need-login', function(msg){
    //var settings = require('athena-settings');
    //var url = settings.api.url + '/file?media_id=' + msg.media_id;
    //wechatApi.sendText(msg.openid, url, function(err, result){
    //    if(err){
    //        logger.error('Fail to send login qrcode url for bot ' + msg.botid + ': ' + err);
    //    }
    //    else{
    //        logger.info('Succeed to send login qrcode url for bot ' + msg.botid);
    //    }
    //});
    wechatApi.sendImage(msg.openid, msg.wx_media_id, function(err, result){
        if(err){
            logger.error('Fail to send login qrcode for bot ' + msg.botid + ': ' + err);
        }
        else{
            logger.info('Succeed to send login qrcode for bot ' + msg.botid);
        }
    });
});

botManager.on('login', function(msg){
    /*
     * Get and check the _id of the bot which is just logged in
     */
    var botid = msg && msg.botid;
    var bot = botManager.getBot(botid);
    var id = bot && bot._id;
    if(!id) return;

    //Set login flag of the bot
    botManager.setLoginFlag(id, true); //TODO

    /**
     * Schedule group-listing-job for the bot
     */
    if(bot.groupListingScheduleId){
        clearInterval(bot.groupListingScheduleId);
        bot.groupListingScheduleId = null;
    }

    setTimeout(function(){
        //Schedule
        bot.groupListingScheduleId = setInterval(function(){
            botManager.requestGroupList(botid);
        }, 1*60*60*1000); //Run job per hour

        //Run it right now
        botManager.requestGroupList(botid);
    }, 10*1000); //schedule the job after 10 seconds of logging in

    /**
     * Schedule contact-listing-remark job for the bot
     */
    if(bot.contactListRemarkingScheduleId){
        clearInterval(bot.contactListRemarkingScheduleId);
        bot.contactListRemarkingScheduleId = null;
    }

    setTimeout(function(){
        //Schedule
        bot.contactListRemarkingScheduleId = setInterval(function(){
            botManager.requestContactListRemark(botid);
        }, 12*60*60*1000); //Run job per hour

        //Run it right now
        botManager.requestContactListRemark(botid);
    }, 20*1000); //schedule the job after 10 seconds of logging in
});

botManager.on('abort', function(msg){
    /*
     * Get and check the _id of the bot which is just logged in
     */
    var botid = msg && msg.botid;
    var bot = botManager.getBot(botid);
    var id = bot && bot._id;
    if(!id) return;

    //Set login flag of the bot
    botManager.setLoginFlag(id, false); //TODO

    /**
     * Cancel scheduling group-listing-job for the bot
     */
    if(bot.groupListingScheduleId){
        clearInterval(bot.groupListingScheduleId);
        bot.groupListingScheduleId = null;
    }
});

botManager.on('contact-added', function(contact){
    wechatBotUserService.createFromContact(contact, function(err, userJson){
        botManager.requestProfile(contact, contact.bid);
    })
});

botManager.on('contact-remarked', function(contact){
    console.error('contact-remarked');
    console.error(contact);
    wechatBotUserService.updateFromProfile(contact.bid, contact, function(err, userJson){
        logger.info('Succeed to remark and create stock user:' + contact);
    })
});

botManager.on('profile', function(profile){
    wechatBotUserService.updateFromProfile(profile.bid, profile, function(err, userJson){
        logger.info('Succeed to update the newly added user with profile:' + profile);
    })
});

botManager.on('group-list', function(data){
    var bot = botManager.getBot(data.botid);
    wechatBotGroupService.syncGroupList(bot._id, data.list, function(err, result){
        if(err){
            logger.error('Fail to request and sync the group list of a bot ' + data.botid);
        }
        else{
            logger.info('Succeed to request and sync the group list of a bot ' + data.botid);
            logger.info('Remove ' + (result && result.removes) + ' groups of bot ' + data.botid);
            logger.info('Add ' + (result && result.adds) + ' groups of bot ' + data.botid);
            logger.info('Update ' + (result && result.updates) + ' groups of bot ' + data.botid);
        }
    })
});

botManager.on('message', customerBotHandler);

setTimeout(function(){
    botManager.proxy.init();
    botManager.init();
}, 5000);

module.exports = botManager;