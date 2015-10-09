var assert = require('chai').assert;
var wxutil = require('../../framework/wechat/util');
var WechatSiteEmitter = require('../../../src/framework/wechat/wechat-site-emitter');
var Wechat = require('../../../src/framework/wechat/index');
var siteEmitter = require('../../../src/modules/assistant/site-emitter');
var mongoose = require('../../../src/app/mongoose');
var redis = require('../../../src/app/redis');
before(function(done){
    setTimeout(function(){
        done()
    }, 3000)
});
describe('cs send a command or a message', function() {
    var platform, client, site, openid, siteClient;
    before(function(done){
        platform = new Wechat.Platform();
        client = wxutil.newSignedInClient(platform);
        site = wxutil.newRegisteredSite(platform);
        siteEmitter.bindSite(site);
        openid = 'okvXqs4vtB5JDwtb8Gd6Rj26W6mE'; //独自等待的错题本openid
        siteClient = client.subscribeSite(site.getId(), openid);
        done();
    });

    it('#plain message', function (done) {
        assert.ok(site.getId());
        siteClient.sendText({
            Content: 'Hi'
        });
        setTimeout(function(){
            done()
        }, 2000)
    });
    it('#online', function (done) {
        assert.ok(site.getId());
        siteClient.sendText({
            Content: '上线'
        });
        setTimeout(function(){
            done()
        }, 2000)
    });
    it('#offline', function (done) {
        assert.ok(site.getId());
        siteClient.sendText({
            Content: '下线'
        });
        setTimeout(function(){
            done()
        }, 2000)
    });
    it('#view state', function (done) {
        assert.ok(site.getId());
        siteClient.sendText({
            Content: '状态'
        });
        setTimeout(function(){
            done()
        }, 2000)
    });
});