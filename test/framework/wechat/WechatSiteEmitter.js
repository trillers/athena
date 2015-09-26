var assert = require('chai').assert;
var wxutil = require('./util');
var WechatSiteEmitter = require('../../../src/framework/wechat/wechat-site-emitter');
var Wechat = require('../../../src/framework/wechat/index');
var siteEmitter = require('../../../src/modules/assistant/site-emitter');

describe('bindSite', function() {
    it('sendText', function (done) {
        var platform = new Wechat.Platform();
        var client = wxutil.newSignedInClient(platform);
        var site = wxutil.newRegisteredSite(platform);
        siteEmitter.bindSite(site);
        var openid = 'okvXqsw1VG76eVVJrKivWDgps_gA'; //包三哥的错题本openid
        var siteClient = client.subscribeSite(site.getId(), openid);


        site.on('text', function(message){
            assert.equal(message.Content, 'hello');
            console.log('=== text message ===');
            console.log(message);
            console.log('\r\n');
        });
        assert.ok(site.getId());


        siteClient.sendText({
            Content: 'hello'
        });

        done();
    })
})
