var assert = require('chai').assert;
var wxutil = require('../../../../framework/wechat/util');
var Wechat = require('../../../../../src/framework/wechat/index');
var siteEmitter = require('../../../../../src/modules/assistant/site-emitter');
var adminService = require('../../../../../src/modules/admin/services/AdminService');
var csService = require('../../../../../src/modules/cs/services/CsService');
var WechatUserService = require('../../../../../src/modules/user/services/WechatUserService');
var userRole = require('../../../../../src/modules/common/models/TypeRegistry').item('UserRole');

before(function(done){
    setTimeout(function(){
        done();
    },2000);
})

describe('request operation state', function() {
    var openid = 'okvXqs4vtB5JDwtb8Gd6Rj26W6mE';//独自等待的错题本openid
    var admin = null;
    before(function(done){
        adminService.createFromOpenid(openid, function(err, data){
            admin = data;
            assert(admin.role, userRole.Admin.value());
            done();
        });
    });
    after(function(done){
        WechatUserService.deleteByOpenid(openid, function(err, user){
            assert.ok(user);
            console.log(user);
            done();
        });
    });

    it('succeed to create user for old user', function (done) {
        var platform = new Wechat.Platform();
        var client = wxutil.newSignedInClient(platform);
        var site = wxutil.newRegisteredSite(platform);
        siteEmitter.bindSite(site);
        var siteClient = client.subscribeSite(site.getId(), openid);

        site.on('text', function(message){
            console.log('=== text message ===');
            console.log(message);
            console.log('\r\n');
        });

        siteClient.sendText({
            Content: '创建老用户'
        });

        setTimeout(function(){
            done();
        }, 20000);
    })
})
