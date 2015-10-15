var assert = require('chai').assert;
var wxutil = require('../../../framework/wechat/util');
var Wechat = require('../../../../src/framework/wechat/index');
var siteEmitter = require('../../../../src/modules/assistant/site-emitter');
var ContextDecorator = require('../../../../src/modules/assistant/common/ContextDecorator');
var wechatUserService = require('../../../../src/modules/user/services/WechatUserService');
var customerService = require('../../../../src/modules/customer/services/CustomerService');

before(function(done){
    setTimeout(function(){
        done();
    },2000);
})

var openid = 'okvXqsw1VG76eVVJrKivWDgps_gA'; //包三哥的错题本openid
describe('create customer when user subscribe or SCAN', function() {
    //before(function(done){
    //    customerService.createFromOpenid(openid, function(err, user){
    //        console.log(user);
    //        done();
    //    });
    //})
    //after(function(done){
    //    wechatUserService.loadByOpenid(openid, function(err, user){
    //        assert.ok(user);
    //        console.log(user);
    //        wechatUserService.deleteByOpenid(openid, function(err, user){
    //            done();
    //        });
    //    });
    //})
    it('create user on subscribing', function (done) {
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

        setTimeout(function(){
            siteClient.sendText({
                Content: '删除当前用户'
            });
        }, 1000);

        setTimeout(function(){
            done();
        }, 2000);
    })
})
