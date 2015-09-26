var assert = require('chai').assert;
var Wechat = require('../../../src/framework/wechat/index');
var wxutil = require('./util');

describe('createClient', function() {
    it('succeed to create a client', function (done) {
        var platform = new Wechat.Platform();
        var clientA = platform.createClient({});
        assert.ok(clientA);
        console.log(clientA);
        console.log('\r\n');
        done();
    })
})

describe('signin', function() {
    it('succeed to signin', function (done) {
        var platform = new Wechat.Platform();
        var userA = wxutil.newRegisteredUser(platform);
        var clientA = platform.createClient({});
        assert.ok(clientA);

        clientA.signin(userA.getUsername());
        assert.ok(clientA.isSignedIn());
        assert.ok(clientA.getSignedInUser());
        console.log(clientA);
        console.log('\r\n');
        done();
    })

    it('fail to signin for no username', function (done) {
        var platform = new Wechat.Platform();
        var clientA = platform.createClient({});
        clientA.signin('');
        assert.notOk(clientA.isSignedIn());
        assert.notOk(clientA.getSignedInUser());
        console.log(clientA);
        console.log('\r\n');
        done();
    })

})

describe('signout', function() {
    it('succeed to signout', function (done) {
        var platform = new Wechat.Platform();
        var clientA = wxutil.newSignedInClient(platform);
        assert.ok(clientA);
        assert.ok(clientA.isSignedIn());

        clientA.signout();
        assert.notOk(clientA.isSignedIn());
        assert.notOk(clientA.getSignedInUser());
        console.log(clientA);
        console.log('\r\n');
        done();
    })

})

describe('subscribeSite', function() {
    it('succeed to subscribeSite', function (done) {
        var platform = new Wechat.Platform();
        var client = wxutil.newSignedInClient(platform);
        var site = wxutil.newRegisteredSite(platform);
        site.on('subscribe', function(message){
            console.log('===subscribe===');
            console.log(message);
            console.log('\r\n');
        });
        site.on('enter', function(message){
            console.log('===enter===');
            console.log(message);
            console.log('\r\n');
        });
        assert.ok(site.getId());

        var siteClient = client.subscribeSite(site.getId());
        assert.ok(siteClient);
        console.log(siteClient);
        console.log('\r\n');
        done();
    })

})

describe('enterSite', function() {
    it('succeed to enterSite', function (done) {
        var platform = new Wechat.Platform();
        var client = wxutil.newSignedInClient(platform);
        var site = wxutil.newRegisteredSite(platform);
        site.on('subscribe', function(message){
            console.log('===subscribe===');
            console.log(message);
        });
        site.on('enter', function(message){
            console.log('===enter===');
            console.log(message);
        });
        site.on('exit', function(message){
            console.log('===exit===');
            console.log(message);
        });
        assert.ok(site.getId());

        var siteClient = client.subscribeSite(site.getId());
        assert.ok(siteClient);

        siteClient.exit();
        console.log(siteClient);

        siteClient = client.enterSite(site.getId());

        assert.ok(siteClient);
        console.log(siteClient);
        done();
    })

})
