var assert = require('chai').assert;
var wxutil = require('./util');
var Wechat = require('../../../src/framework/wechat/index');
var siteEmitter = require('../../../src/modules/assistant/site-emitter');
var mongoose = require('../../../src/app/mongoose');
var redis = require('../../../src/app/redis');

before(function(done){
    setTimeout(function(){
        done();
    },3000);
})

describe('subscribeSite', function() {
    describe('succeed to subscribe site', function () {
        before(function(done){
            done();
        })
        it('succeed to subscribe site to create a user', function(done){
            var platform = new Wechat.Platform();
            var client = wxutil.newSignedInClient(platform);
            var site = wxutil.newRegisteredSite(platform);
            siteEmitter.bindSite(site);
            var openid = 'okvXqsw1VG76eVVJrKivWDgps_gA'; //包三哥的错题本openid
            var siteClient = client.subscribeSite(site.getId(), openid);

            setTimeout(function(){
                done();
            }, 1000);
        })
    })
})
