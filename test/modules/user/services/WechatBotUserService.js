var assert = require('chai').assert;
var mongoose = require('../../../../src/app/mongoose');
var redis = require('../../../../src/app/redis');
var wechatBotUserService = require('../../../../src/modules/user/services/wechatBotUserService');
var wechatUserService = require('../../../../src/modules/user/services/wechatUserService');

describe('WechatBotUserService', function() {
    before(function(done){
        setTimeout(function(){
            done();
        },3000);
    })

    describe('#createFromContact', function() {
        it('succeed to create wechat bot user from bid', function (done) {
            var buid = wechatBotUserService.generateBuid();
            var siteId = 'gh_afc333104d2a'; //错题本服务号的原始ID
            var openid = 'okvXqsw1VG76eVVJrKivWDgps_gA'; //包三哥的错题本openid
            var nickname = '包三哥';
            var botid = siteId + ':' + openid;

            var botUserInfo = {
                botid: botid,
                bid: buid,
                nickname: nickname
            };
            wechatBotUserService.createFromContact(botUserInfo, function(err, user){
                assert.ok(user);
                console.log(user);
                done();
            });
        })
    })


    describe('#updateFromProfile', function() {
        var buid = null;
        var siteId = 'gh_afc333104d2a'; //错题本服务号的原始ID
        var openid = 'okvXqsw1VG76eVVJrKivWDgps_gA'; //包三哥的错题本openid
        var nickname = '包三哥';
        var botid = siteId + ':' + openid;
        describe('update and cannot find an existed site user', function() {
            before(function (done) {
                buid = wechatBotUserService.generateBuid();
                var contactInfo = {
                    botid: botid,
                    bid: buid,
                    nickname: nickname
                };
                wechatBotUserService.createFromContact(contactInfo, function(err, user){
                    assert.ok(user);
                    console.log(user);
                    done();
                });
            })
            it('succeed to update wechat bot user from profile without linking to site user', function (done) {
                var profileInfo = {
                    botid: botid,
                    bid: buid,
                    nickname: nickname,
                    headimgid: 'abc',
                    place: '中国 北京'
                };
                wechatBotUserService.updateFromProfile(buid, profileInfo, function(err, user){
                    assert.ok(user);
                    console.log(user);
                    done();
                });
            })
        })

        describe('update and link to an existed site user', function() {
            var siteUserId = null;
            before(function (done) {
                buid = wechatBotUserService.generateBuid();
                var contactInfo = {
                    botid: botid,
                    bid: buid,
                    nickname: nickname
                };
                wechatUserService.loadOrCreateFromWechat(openid, function(err, siteUser){
                    assert.ok(siteUser);
                    console.log(siteUser);
                    siteUserId = siteUser.id;
                    wechatBotUserService.createFromContact(contactInfo, function(err, botUser){
                        assert.ok(botUser);
                        console.log(botUser);
                        done();
                    });
                })
            })

            it('succeed to update wechat bot user from profile with linking to site user', function (done) {
                var profileInfo = {
                    botid: botid,
                    bid: buid,
                    nickname: nickname,
                    headimgid: 'abc',
                    place: '中国 北京'
                };
                wechatBotUserService.updateFromProfile(buid, profileInfo, function(err, user){
                    assert.ok(user);
                    assert.equal(user.siteUser, siteUserId);
                    console.log(user);
                    done();
                });
            })
        })

        describe('load and create a brand new bot user', function() {
            before(function (done) {
                buid = wechatBotUserService.generateBuid();
                done();
            })

            it('succeed to load and create wechat bot user from profile without linking to site user', function (done) {
                var profileInfo = {
                    botid: botid,
                    bid: buid,
                    nickname: nickname,
                    headimgid: 'abc',
                    place: '中国 北京'
                };
                wechatBotUserService.updateFromProfile(buid, profileInfo, function(err, user){
                    assert.ok(user);
                    console.log(user);
                    done();
                });
            })
        })
    })

})