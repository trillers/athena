//var assert = require('chai').assert;
//var wxutil = require('../../../../framework/wechat/util');
//var Wechat = require('../../../../../src/framework/wechat/index');
//var siteEmitter = require('../../../../../src/modules/assistant/site-emitter');
//var adminService = require('../../../../../src/modules/admin/services/AdminService');
//var wechatUserService = require('../../../../../src/modules/user/services/WechatUserService');
//var userRole = require('../../../../../src/modules/common/models/TypeRegistry').item('UserRole');
//var mongoose = require('../../../../../src/app/mongoose');
//var redis = require('../../../../../src/app/redis');
//
//before(function(done){
//    setTimeout(function(){
//        done();
//    },2000);
//})
//
//describe('request cs qr', function() {
//    var openid = 'okvXqs4vtB5JDwtb8Gd6Rj26W6mE';
//
//    var openid = 'okvXqs4vtB5JDwtb8Gd6Rj26W6mE';//独自等待的错题本openid
//    var admin = null;
//    before(function(done){
//        adminService.createFromOpenid(openid, function(err, user){
//            assert.ok(user);
//            assert(user.role, userRole.Admin.value());
//            done();
//        });
//    })
//    after(function(done){
//        wechatUserService.deleteByOpenid(openid, function(err, user){
//            assert.ok(user);
//            done();
//        });
//    });
//    it('succeed to request cs qr', function (done) {
//        var platform = new Wechat.Platform();
//        var client = wxutil.newSignedInClient(platform);
//        var site = wxutil.newRegisteredSite(platform);
//        siteEmitter.bindSite(site);
//        var siteClient = client.subscribeSite(site.getId(), openid);
//
//        site.on('text', function(message){
//            console.log('=== text message ===');
//            console.log(message);
//            console.log('\r\n');
//        });
//
//        siteClient.sendText({
//            Content: '客服二维码'
//        });
//
//        setTimeout(function(){
//            done();
//        }, 4000);
//    })
//})
