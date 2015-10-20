var assert = require('chai').assert;
var WechatBotManager = require('../../../../src/modules/wechat-bot/services/WechatBotManager');
var mongoose = require('../../../../src/app/mongoose');

describe('WechatBotManager', function() {

    before(function(done){
        setTimeout(function(){
            done();
        },3000);
    })

    describe('#init', function() {
        var siteId = 'gh_afc333104d2a'; //错题本服务号的原始ID
        before(function(done){
            done();
        })

        it('init to load all bots from db', function (done) {
            var botManager = new WechatBotManager();
            botManager.on('init', function(){
                console.info('wechat bot manager is initiated!');
                done();
            });
            botManager.on('init-error', function(err){
                console.info('wechat bot manager fails to init: ' + err);
                done();
            });

            botManager.init();
        })
    })

    describe('#register', function() {
        var siteId = 'gh_afc333104d2a'; //错题本服务号的原始ID
        var openid = 'okvXqsw1VG76eVVJrKivWDgps_gA11'; //包三哥的错题本openid
        before(function(done){
            done();
        })

        it('register a bot', function (done) {
            var botManager = new WechatBotManager();
            botManager.on('register', function(bot){
                console.info('wechat bot is registered successfully!');
                console.info(bot);
                console.info('\r\n');
                done();
            });
            botManager.on('register-error', function(err){
                console.info('wechat bot fails to be registered: ' + err);
                done();
            });

            var botInfo = {
                bucketid: siteId
                , openid: openid
                , nickname: '包三哥'
            };
            botManager.register(botInfo);
        })
    })

    describe('#unregister', function() {
        var siteId = 'gh_afc333104d2a'; //错题本服务号的原始ID
        var openid = 'okvXqsw1VG76eVVJrKivWDgps_gA11'; //包三哥的错题本openid
        var nickname = '包三哥';
        var botManager = new WechatBotManager();
        before(function(done){
            botManager.on('register', function(bot){
                console.info('wechat bot is registered successfully!');
                console.info(bot);
                console.info('\r\n');
                done();
            });
            botManager.on('register-error', function(err){
                console.info('wechat bot fails to be registered: ' + err);
                done();
            });

            var botInfo = {
                bucketid: siteId
                , openid: openid
                , nickname: nickname
            };
            botManager.register(botInfo);
        })

        it('unregister a bot by bot bucketid and openid', function (done) {
            var botInfo = {
                bucketid: siteId
                , openid: openid
                , nickname: nickname
            };
            botManager.unregister(botInfo, function(err, bot){
                assert.ok(bot);
                assert.equal(bot.info.bucketid, siteId);
                assert.equal(bot.info.openid, openid);
                console.info(bot);
                done();
            });
        })
    })

})