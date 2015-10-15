var assert = require('chai').assert;
var Wechat = require('../../../src/framework/wechat/index');
var wxutil = require('./util');

describe('unsubscribe', function() {
    it('succeed to unsubscribe', function (done) {
        var platform = new Wechat.Platform();
        var client = wxutil.newSignedInClient(platform);
        var site = wxutil.newRegisteredSite(platform);
        site.on('unsubscribe', function(message){
            console.log('===unsubscribe===');
            console.log(message);
            console.log('\r\n');
        });
        site.on('exit', function(message){
            console.log('===exit===');
            console.log(message);
            console.log('\r\n');
        });
        assert.ok(site.getId());
        var siteClient = client.subscribeSite(site.getId());
        assert.ok(siteClient);

        siteClient.unsubscribe();
        assert.notOk(siteClient.site);

        console.log(siteClient);
        console.log('\r\n');
        done();
    })

})

describe('exit', function() {
    it('succeed to exit', function (done) {
        var platform = new Wechat.Platform();
        var client = wxutil.newSignedInClient(platform);
        var site = wxutil.newRegisteredSite(platform);
        site.on('exit', function(message){
            console.log('===exit===');
            console.log(message);
            console.log('\r\n');
        });
        assert.ok(site.getId());

        var siteClient = client.subscribeSite(site.getId());
        assert.ok(siteClient);

        siteClient.exit();
        console.log(siteClient);
        console.log('\r\n');
        done();
    })

})

describe('sendText', function() {
    it('succeed to send text', function (done) {
        var platform = new Wechat.Platform();
        var client = wxutil.newSignedInClient(platform);
        var site = wxutil.newRegisteredSite(platform);
        site.on('text', function(message){
            assert.equal(message.Content, 'hello');
            console.log('=== text message ===');
            console.log(message);
            console.log('\r\n');
        });
        assert.ok(site.getId());

        var siteClient = client.subscribeSite(site.getId());
        assert.ok(siteClient);

        siteClient.sendText({
            Content: 'hello'
        });

        done();
    })
})

describe('sendImage', function() {
    it('succeed to send image', function (done) {
        var platform = new Wechat.Platform();
        var client = wxutil.newSignedInClient(platform);
        var site = wxutil.newRegisteredSite(platform);
        site.on('image', function(message){
            assert.equal(message.PicUrl, 'http://mbnsclinic.co.uk/wp-content/uploads/2015/03/Monica-Bellucci-monica-bellucci-14168918-1600-1200.jpg');
            assert.equal(message.MediaId, 'asdfasdfasdf');
            console.log('=== image message ===');
            console.log(message);
            console.log('\r\n');
        });
        assert.ok(site.getId());

        var siteClient = client.subscribeSite(site.getId());
        assert.ok(siteClient);

        siteClient.sendImage({
            PicUrl: 'http://mbnsclinic.co.uk/wp-content/uploads/2015/03/Monica-Bellucci-monica-bellucci-14168918-1600-1200.jpg',
            MediaId: 'asdfasdfasdf'
        });

        done();
    })
})

describe('sendVoice', function() {
    it('succeed to send voice', function (done) {
        var platform = new Wechat.Platform();
        var client = wxutil.newSignedInClient(platform);
        var site = wxutil.newRegisteredSite(platform);
        site.on('voice', function(message){
            assert.equal(message.Format, 'amr');
            assert.equal(message.MediaId, 'asdfasdfasdf');
            console.log('=== voice message ===');
            console.log(message);
            console.log('\r\n');
        });
        assert.ok(site.getId());

        var siteClient = client.subscribeSite(site.getId());
        assert.ok(siteClient);

        siteClient.sendVoice({
            Format: 'amr',
            MediaId: 'asdfasdfasdf'
        });

        done();
    })
})
