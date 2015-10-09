var assert = require('chai').assert;
var wxutil = require('../../../../framework/wechat/util');
var WechatSiteEmitter = require('../../../../../src/framework/wechat/wechat-site-emitter');
var Wechat = require('../../../../../src/framework/wechat/index');
var siteEmitter = require('../../../../../src/modules/assistant/site-emitter');
var mongoose = require('../../../../../src/app/mongoose');
var redis = require('../../../../../src/app/redis');

before(function(done){
    setTimeout(function(){
        done();
    },2000);
})

describe('delete user', function() {

    //Create an admin user
    before(function(done){
        done();
    })

    it('succeed to delete user by openid', function (done) {
        var platform = new Wechat.Platform();
        var client = wxutil.newSignedInClient(platform);
        var site = wxutil.newRegisteredSite(platform);
        siteEmitter.bindSite(site);
        //var openid = 'okvXqsw1VG76eVVJrKivWDgps_gA'; //包三哥的错题本openid
        var openid = 'okvXqs4vtB5JDwtb8Gd6Rj26W6mE';
        var siteClient = client.subscribeSite(site.getId(), openid);

        site.on('text', function(message){
            console.log('=== text message ===');
            console.log(message);
            console.log('\r\n');
        });

        siteClient.sendText({
            Content: '客服二维码'
        });

        setTimeout(function(){
            done();
        }, 1000);
    })
})
