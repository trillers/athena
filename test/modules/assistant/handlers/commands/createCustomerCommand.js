var assert = require('chai').assert;
var wxutil = require('../../../../framework/wechat/util');
var Wechat = require('../../../../../src/framework/wechat/index');
var siteEmitter = require('../../../../../src/modules/assistant/site-emitter');
var mongoose = require('../../../../../src/app/mongoose');
var redis = require('../../../../../src/app/redis');
var wechatUserService = require('../../../../../src/modules/user/services/WechatUserService');

before(function(done){
    setTimeout(function(){
        done();
    },2000);
})

describe('create customer when user subscribe or SCAN', function() {
    var openid = 'okvXqsw1VG76eVVJrKivWDgps_gA'; //包三哥的错题本openid
    before(function(done){
        wechatUserService.deleteByOpenid(openid, function(err, user){
            console.log(user);
            done();
        });
    })
    after(function(done){
        wechatUserService.loadByOpenid(openid, function(err, user){
            assert.ok(user);
            console.log(user);
            wechatUserService.deleteByOpenid(openid, function(err, user){
                done();
            });
        });
    })
    it('create user on subscribing', function (done) {
        var platform = new Wechat.Platform();
        var client = wxutil.newSignedInClient(platform);
        var site = wxutil.newRegisteredSite(platform);
        siteEmitter.bindSite(site);
        var siteClient = client.subscribeSite(site.getId(), openid);

        setTimeout(function(){
            done();
        }, 1000);
    })
})
