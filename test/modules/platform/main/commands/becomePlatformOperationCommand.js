var assert = require('chai').assert;
var wxutil = require('../../../../framework/wechat/util');
var Wechat = require('../../../../../src/framework/wechat/index');
var context = require('../../../../../src/');
var wechatemitter = require('../../../../../src/modules/system/wechatsite/wechatemitter');

var mongoose = require('../../../../../src/app/mongoose');
var redis = require('../../../../../src/app/redis');

before(function(done){
    setTimeout(function(){
        done();
    },2000);
})

describe('platform operation handler', function() {
    var openid = 'okvXqsw1VG76eVVJrKivWDgps_gA';//包三哥的错题本openid
    it('success send tenant registry qr code', function (done) {
        var platform = new Wechat.Platform();
        var client = wxutil.newSignedInClient(platform);
        var site = wxutil.newRegisteredSite(platform);
        wechatemitter.bindSite(site);
        var siteClient = client.subscribeSite(site.getId(), openid);

        site.on('text', function(message){
            console.log('=== text message ===');
            console.log(message);
            console.log('\r\n');
        });

        siteClient.sendText({
            Content: '成为平台运营专员'
        });

        setTimeout(function(){
            done();
        }, 4000);
    })
})

