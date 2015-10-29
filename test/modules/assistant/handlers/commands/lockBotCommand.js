var assert = require('chai').assert;
var wxutil = require('../../../../framework/wechat/util');
var Wechat = require('../../../../../src/framework/wechat/index');
var siteEmitter = require('../../../../../src/modules/assistant/site-emitter');
var customerService = require('../../../../../src/modules/customer/services/CustomerService');
var userRole = require('../../../../../src/modules/common/models/TypeRegistry').item('UserRole');
var WechatUserService = require('../../../../../src/modules/user/services/WechatUserService');

var openid = 'okvXqsw1VG76eVVJrKivWDgps_gA'; //包三哥的错题本openid
var siteId = 'gh_afc333104d2a'; //错题本服务号的原始ID

before(function(done){
    setTimeout(function(){
        done();
    },2000);
})

describe.only('lockBot', function() {
    var customer = null;
    //before(function(done){
    //    customerService.createFromOpenid(openid, function(err, data){
    //        customer = data;
    //        assert(customer.role, userRole.Customer.value());
    //        done();
    //    });
    //});
    //after(function(done){
    //    WechatUserService.deleteByOpenid(openid, function(err, user){
    //        assert.ok(user);
    //        console.log(user);
    //        done();
    //    });
    //});
    it('succeed to lock bot', function (done) {
        var platform = new Wechat.Platform();
        var client = wxutil.newSignedInClient(platform);
        var site = wxutil.newRegisteredSite(platform, siteId);
        siteEmitter.bindSite(site);
        var siteClient = client.subscribeSite(site.getId(), openid);

        site.on('text', function(message){
            console.log('=== text message ===');
            console.log(message);
            console.log('\r\n');
        });

        siteClient.sendText({
            Content: '锁定微信助手'
        });

        setTimeout(function(){
            done();
        }, 1000);
    })
})
