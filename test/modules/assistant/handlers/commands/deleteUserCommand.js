var assert = require('chai').assert;
var wxutil = require('../../../../framework/wechat/util');
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
    it('succeed to delete user by openid', function (done) {
        var platform = new Wechat.Platform();
        var client = wxutil.newSignedInClient(platform);
        var site = wxutil.newRegisteredSite(platform);
        siteEmitter.bindSite(site);
        var openid = 'okvXqsw1VG76eVVJrKivWDgps_gA'; //包三哥的错题本openid
        var siteClient = client.subscribeSite(site.getId(), openid);

        site.on('text', function(message){
            console.log('=== text message ===');
            console.log(message);
            console.log('\r\n');
        });
        assert.ok(site.getId());


        siteClient.sendText({
            Content: '删除当前用户'
        });

        setTimeout(function(){
            done();
        }, 1000);
    })
})
