var assert = require('chai').assert;
var WechatBotManager = require('../../../../src/modules/wechat-bot/services/WechatBotManager');
var botManager = require('../../../../src/modules/assistant/botManager');
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
            //var botManager = new WechatBotManager();
            botManager.on('init', function(){
                console.info('wechat bot manager is initiated!');
                var map = botManager.getNameMap();
                console.log(map);
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
        var openid = 'okvXqsw1VG76eVVJrKivWDgps_gA'; //包三哥的错题本openid

        it('register a bot', function (done) {
            //var botManager = new WechatBotManager();
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
        var openid = 'okvXqsw1VG76eVVJrKivWDgps_gA'; //包三哥的错题本openid
        var nickname = '包三哥';
        //var botManager = new WechatBotManager();
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
                assert.equal(bot.bucketid, siteId);
                assert.equal(bot.openid, openid);
                console.info(bot);
                done();
            });
        })
    })

    describe('#lock', function() {
        var siteId = 'gh_afc333104d2a'; //错题本服务号的原始ID
        var openid = 'okvXqsw1VG76eVVJrKivWDgps_gA'; //包三哥的错题本openid
        var nickname = '包三哥';
        //var botManager = new WechatBotManager();
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

        it('lock a bot by bot bucketid and openid', function (done) {
            var botInfo = {
                bucketid: siteId
                , openid: openid
                , nickname: nickname
            };
            botManager.lock(botInfo, function(err, bot){
                assert.ok(bot);
                assert.equal(bot.bucketid, siteId);
                assert.equal(bot.openid, openid);
                console.info(bot);
                done();
            });
        })
    })

    describe('#requestContactListRemarking', function() {
        var siteId = 'gh_afc333104d2a'; //错题本服务号的原始ID
        var openid = 'okvXqs1DXRfyOrUrJEOXU3RStkyY'; //酒剑仙的错题本openid
        var nickname = '酒剑仙';
        //var botManager = new WechatBotManager();
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

        it('request remark all contacts of a bot', function (done) {
            var botInfo = {
                bucketid: siteId
                , openid: openid
                , nickname: nickname
            };
            botManager.requestContactListRemark(botInfo, function(err, bot){
                assert.ok(bot);
                assert.equal(bot.bucketid, siteId);
                assert.equal(bot.openid, openid);
                console.info(bot);
                done();
            });
        })
    })

    describe('#requestProfile', function() {
        var siteId = 'gh_afc333104d2a'; //错题本服务号的原始ID
        var openid = 'okvXqs_VftHruzwFV9rx4Pbd_fno'; //包三哥的错题本openid
        var bid = "5835e1a0-7539-";


        before(function(done){
            done();
        })

        it('test the format of requested profile', function (done) {
            //var botManager = new WechatBotManager();
            var botInfo = {
                bucketid: siteId
                , openid: openid
                , nickname: '包三哥'
            };

            botManager.requestProfile(botInfo, bid);
            setTimeout(function(){
                done();
            }, 5000);
        })
    })

    describe('#requestGroupList', function() {
        var siteId = 'gh_afc333104d2a'; //错题本服务号的原始ID
        var openid = 'okvXqsw1VG76eVVJrKivWDgps_gA'; //包三哥的错题本openid

        it('sync groups of a bot', function (done) {
            var botInfo = {
                bucketid: siteId
                , openid: openid
            };

            botManager.requestGroupList(botInfo);
            setTimeout(function(){
                done();
            }, 2000);
        })
    })

    describe('Event:message', function() {
        var siteId = 'gh_afc333104d2a'; //错题本服务号的原始ID
        var openid = 'okvXqsw1VG76eVVJrKivWDgps_gA'; //包三哥的错题本openid
        var nickname = '包三哥';
        var botid = siteId + ':' + openid;
        var bid = 'abcd';
        //var botManager = new WechatBotManager();

        it('to test message event if it follows given format', function (done) {
            botManager.on('message', function(message){
                assert.ok(message);
                assert.equal(message.bucketid, siteId);
                assert.equal(message.openid, openid);
                assert.equal(message.FromUserName, bid);
                assert.equal(message.ToUserName, botid);
                assert.equal(message.MsgType, 'text');
                assert.equal(message.Content, 'hello');
                console.info(message);
                done();
            });
            botManager.proxy.emit('message', null, {
                FromUserName: bid,
                ToUserName: botid,
                MsgType: 'text',
                Content: 'hello'
            });
        })
    })

    describe('Event:profile', function() {
        var siteId = 'gh_afc333104d2a'; //错题本服务号的原始ID
        var openid = 'okvXqsw1VG76eVVJrKivWDgps_gA'; //包三哥的错题本openid
        var nickname = '包三哥';
        var botid = siteId + ':' + openid;
        var bid = 'abcd';
        //var botManager = new WechatBotManager();

        it('to test profile event if it follows given format', function (done) {
            botManager.on('profile', function(message){
                assert.ok(message);
                assert.equal(message.bucketid, siteId);
                assert.equal(message.openid, openid);
                assert.equal(message.bid, bid);
                assert.equal(message.nickname, nickname);
                assert.equal(message.place, '北京');
                console.info(message);
                done();
            });
            botManager.proxy.emit('profile', null, {
                bid: bid,
                botid: botid,
                nickname: nickname,
                place: '北京'
            });
        })
    })

    describe('Event:contact-added', function() {
        var siteId = 'gh_afc333104d2a'; //错题本服务号的原始ID
        var openid = 'okvXqsw1VG76eVVJrKivWDgps_gA'; //包三哥的错题本openid
        var nickname = '包三哥';
        var botid = siteId + ':' + openid;
        var bid = 'abcd';
        //var botManager = new WechatBotManager();

        it('to test contact-added event if it follows given format', function (done) {
            botManager.on('contact-added', function(message){
                assert.ok(message);
                assert.equal(message.bucketid, siteId);
                assert.equal(message.openid, openid);
                assert.equal(message.bid, bid);
                assert.equal(message.nickname, nickname);
                console.info(message);
                done();
            });
            botManager.proxy.emit('contact-added', null, {
                bid: bid,
                botid: botid,
                nickname: nickname
            });
        })
    })

    describe('Event:need-login', function() {
        var siteId = 'gh_afc333104d2a'; //错题本服务号的原始ID
        var openid = 'okvXqsw1VG76eVVJrKivWDgps_gA'; //包三哥的错题本openid
        var nickname = '包三哥';
        var botid = siteId + ':' + openid;
        var bid = 'abcd';
        //var botManager = new WechatBotManager();

        it('to test need-login event if it follows given format', function (done) {
            botManager.on('need-login', function(message){
                assert.ok(message);
                assert.equal(message.bucketid, siteId);
                assert.equal(message.openid, openid);
                assert.equal(message.media_id, 'abcd');
                console.info(message);
                done();
            });
            botManager.proxy.emit('need-login', null, {
                botid: botid,
                media_id: 'abcd'
            });
        })
    })
})