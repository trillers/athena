var assert = require('chai').assert;
var wxutil = require('../../framework/wechat/util');
var WechatSiteEmitter = require('../../../src/framework/wechat/command');
var Wechat = require('../../../src/framework/wechat/index');
var siteEmitter = require('../../../src/modules/assistant/site-emitter');
//var mongoose = require('../../../src/app/mongoose');
var redis = require('../../../src/app/redis');
before(function(done){
    setTimeout(function(){
        done();
    },3000);
})
//describe('send a cs message', function() {
//    it('succeed to send', function (done) {
//        done();
//        //console.log("ok");
//        //var platform = new Wechat.Platform();
//        //var client = wxutil.newSignedInClient(platform);
//        //var site = wxutil.newRegisteredSite(platform);
//        //siteEmitter.bindSite(site);
//        //var openid = 'okvXqsw1VG76eVVJrKivWDgps_gA'; //包三哥的错题本openid
//        //var siteClient = client.subscribeSite(site.getId(), openid);
//        //
//        //
//        //site.on('text', function(message){
//        //    console.log('=== text message ===');
//        //    console.log(message);
//        //    console.log('\r\n');
//        //});
//        //assert.ok(site.getId());
//        //
//        //console.log("ok");
//        //siteClient.sendText({
//        //    Content: 'hi'
//        //});
//        //setTimeout(function(){
//        //    done()
//        //}, 2000)
//    })
//});

describe('test',function(){
    it('test1', function(done){
        done();
    })
})