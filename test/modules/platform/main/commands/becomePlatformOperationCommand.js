var assert = require('chai').assert;
var wxutil = require('../../../../framework/wechat/util');
var Wechat = require('../../../../../src/framework/wechat/index');
var context = require('../../../../../src/');
//var siteEmitter = require('../../../../src/modules/assistant/site-emitter');
var wechatemitter = require('../../../../../src/modules/system/wechatsite/wechatemitter');

var mongoose = require('../../../../../src/app/mongoose');
var redis = require('../../../../../src/app/redis');

before(function(done){
    setTimeout(function(){
        done();
    },2000);
})

describe('platform operation handler', function() {
    var openid = 'okvXqs4vtB5JDwtb8Gd6Rj26W6mE';//独自等待的错题本openid
    //before(function(done){
    //    adminService.createFromOpenid(openid, function(err, user){
    //        assert.ok(user);
    //        assert(user.role, userRole.Admin.value());
    //        done();
    //    });
    //})
    //after(function(done){
    //    wechatUserService.deleteByOpenid(openid, function(err, user){
    //        assert.ok(user);
    //        done();
    //    });
    //});
    it('success send tenant registry qr code', function (done) {
        var platform = new Wechat.Platform();
        var client = wxutil.newSignedInClient(platform);
        var site = wxutil.newRegisteredSite(platform);
        wechatemitter.bindSite(site);
        var siteClient = client.subscribeSite(site.getId(), openid);

        site.on('text', function(message){
            console.log('=== text message ===');
            console.log(message);
            console.log('\r\n');
        });

        siteClient.sendText({
            Content: '成为平台运营专员'
        });

        setTimeout(function(){
            done();
        }, 4000);
    })
})

