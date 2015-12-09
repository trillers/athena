var assert = require('chai').assert;
var wxutil = require('../../../../framework/wechat/util');
var Wechat = require('../../../../../src/framework/wechat/index');
var context = require('../../../../../src/');
var wechatemitter = require('../../../../../src/modules/system/wechatsite/wechatemitter');
var TenantMemberRole = require('../../../../../src/modules/common/models/TypeRegistry').item('TenantMemberRole');

var mongoose = require('../../../../../src/app/mongoose');
var redis = require('../../../../../src/app/redis');

before(function(done){
    setTimeout(function(){
        done();
    },2000);
})

describe.only('requestOrgRegistrationQrCodeCommand', function() {
    var openid = 'okvXqs4vtB5JDwtb8Gd6Rj26W6mE';//独自等待的错题本openid
    before(function(done){
        var service = context.services.platformService;
        service.registerPlatformPost(openid, TenantMemberRole.PlatformOperation.value(), function(err, user){
            assert.equal(user.posts[0].role, TenantMemberRole.PlatformOperation.value());
            done();
        });
    })
    it('success requestOrgRegistrationQrCodeCommand', function (done) {
        var platform = new Wechat.Platform();
        var client = wxutil.newSignedInClient(platform);
        var site = wxutil.newRegisteredSite(platform);
        wechatemitter.bindSite(site);
        var siteClient = client.subscribeSite(site.getId(), openid);

        siteClient.sendText({
            Content: '账户邀请二维码'
        });

        setTimeout(function(){
            done();
        }, 4000);
    })
})

