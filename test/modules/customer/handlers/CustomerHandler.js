var assert = require('chai').assert;
var wxutil = require('../../../framework/wechat/util');
var Wechat = require('../../../../src/framework/wechat/index');
var siteEmitter = require('../../../../src/modules/assistant/site-emitter');
var mongoose = require('../../../../src/app/mongoose');
var redis = require('../../../../src/app/redis');
var csService = require('../../../../src/modules/cs/services/CsService');
var customerService = require('../../../../src/modules/customer/services/CustomerService');
var WechatUserService = require('../../../../src/modules/user/services/WechatUserService');
before(function(done){
    setTimeout(function(){
        done()
    }, 3000)
});
describe('send a customer message', function () {
    var platform, clientA, clientB, site, openid, siteClientA, siteClientB, prepareOpenid;
    before(function(done){
        openid = 'okvXqs4vtB5JDwtb8Gd6Rj26W6mE'; //独自等待的错题本openid
        prepareOpenid = 'okvXqswFmgRwEV0YrJ-h5YvKhdUk'; //祺天大圣的openid
        csService.createFromOpenidAsync(prepareOpenid)
        .then(function(){
            return customerService.createFromOpenidAsync(openid)
        })
        .then(function(){
            platform = new Wechat.Platform();
            clientA = wxutil.newSignedInClient(platform);
            clientB = wxutil.newSignedInClient(platform);
            site = wxutil.newRegisteredSite(platform);
            siteEmitter.bindSite(site);
            siteClientA = clientA.subscribeSite(site.getId(), openid);
            siteClientB = clientB.subscribeSite(site.getId(), prepareOpenid);
            done();
        })
    });
    //after(function(done){
    //    WechatUserService.deleteByOpenid(prepareOpenid, function(err, user){
    //        WechatUserService.deleteByOpenid(openid, function(err, user){
    //            done();
    //        });
    //    });
    //});
    describe('create a new conversation and assign it to a cs', function () {
        before(function(done){
            done();
        });
        after(function(done){
            done();
        });
        it('a cs online and free, then a custom send a msg, the cvs assign to the cs', function(done){
            assert.ok(site.getId());
            siteClientB.sendText({
                Content: '上线'
            });
            setTimeout(function(){
                siteClientA.sendText({
                    Content: 'Hi'
                });
                done();
            }, 10000);
        });
    });
    //describe('the conversation already exist, send the message directly', function () {
    //    before(function(done){
    //        done();
    //    });
    //    it('success', function(done){
    //        assert.ok(site.getId());
    //        console.log(assert.ok);
    //        siteClient.sendText({
    //            Content: 'Hi'
    //        });
    //        setTimeout(function(){
    //            done()
    //        }, 2000)
    //    });
    //});

});