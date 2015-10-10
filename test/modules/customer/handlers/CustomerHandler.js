var assert = require('chai').assert;
var wxutil = require('../../../framework/wechat/util');
var WechatSiteEmitter = require('../../../../src/framework/wechat/wechat-site-emitter');
var Wechat = require('../../../../src/framework/wechat/index');
var siteEmitter = require('../../../../src/modules/assistant/site-emitter');
var mongoose = require('../../../../src/app/mongoose');
var redis = require('../../../../src/app/redis');
before(function(done){
    setTimeout(function(){
        done()
    }, 3000)
});
describe('send a customer message', function () {
    var platform, client, site, openid, siteClient;
    before(function(done){
        //prepare data
        platform = new Wechat.Platform();
        client = wxutil.newSignedInClient(platform);
        site = wxutil.newRegisteredSite(platform);
        siteEmitter.bindSite(site);
        openid = 'okvXqs4vtB5JDwtb8Gd6Rj26W6mE'; //独自等待的错题本openid
        siteClient = client.subscribeSite(site.getId(), openid);

        //modify the user,s role to a customer

        done();
    });
    describe('create a new conversation and assign it to a cs', function () {
        before(function(done){
            done();
        });
        it('success', function(done){
            assert.ok(site.getId());
            console.log(assert.ok);
            siteClient.sendText({
                Content: 'Hi'
            });
            setTimeout(function(){
                done()
            }, 2000)
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