//var assert = require('chai').assert;
//var wxutil = require('../../../../framework/wechat/util');
//var Wechat = require('../../../../../src/framework/wechat/index');
//var siteEmitter = require('../../../../../src/modules/assistant/site-emitter');
//var adminService = require('../../../../../src/modules/admin/services/AdminService');
//var csService = require('../../../../../src/modules/cs/services/CsService');
//var WechatUserService = require('../../../../../src/modules/user/services/WechatUserService');
//var userRole = require('../../../../../src/modules/common/models/TypeRegistry').item('UserRole');
//
//before(function(done){
//    setTimeout(function(){
//        done();
//    },2000);
//})
//
//describe('request operation state', function() {
//    var openid = 'okvXqs4vtB5JDwtb8Gd6Rj26W6mE';//独自等待的错题本openid
//    var testOpenid = 'okvXqswFmgRwEV0YrJ-h5YvKhdUk';//齐天大圣的错题本openid
//    var admin = null, cs = null;
//    before(function(done){
//        adminService.createFromOpenid(openid, function(err, data){
//            admin = data;
//            assert(admin.role, userRole.Admin.value());
//            csService.createFromOpenid(testOpenid, function(err, data){
//                cs = data;
//                assert(cs.role, userRole.CustomerService.value());
//                done();
//            });
//        });
//    });
//    after(function(done){
//        WechatUserService.deleteByOpenid(openid, function(err, user){
//            assert.ok(user);
//            console.log(user);
//            WechatUserService.deleteByOpenid(testOpenid, function(err, user){
//                assert.ok(user);
//                console.log(user);
//                done();
//            });
//        });
//    });
//
//    it('succeed to request operation state', function (done) {
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
//            Content: '运营状态'
//        });
//
//        setTimeout(function(){
//            done();
//        }, 4000);
//    })
//})
