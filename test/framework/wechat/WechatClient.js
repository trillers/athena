var assert = require('chai').assert;
var Wechat = require('../../../src/framework/wechat/index');
var wxutil = require('./util');
var WechatEmitter = require('../../../src/framework/WechatEmitter');

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

describe('scanSite', function() {
    it('succeed to scanSite to trigger qrsubscribe event', function (done) {
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

        var api = site.getApi();
        var sceneId = 101;
        var ticket = '';
        api.createLimitQRCode(sceneId, function(err, result){
            ticket = result.ticket;
        });

        var siteClient = client.scanSite(site.getId(), sceneId);
        done();
    })

    it('succeed to scanSite to trigger qrSCAN event', function (done) {
        var platform = new Wechat.Platform();
        var client = wxutil.newSignedInClient(platform);
        var site = wxutil.newRegisteredSite(platform);
        site.on('subscribe', function(message){
            console.log('===subscribe===');
            console.log(message);
            console.log('\r\n');
        });
        site.on('SCAN', function(message){
            console.log('===SCAN===');
            console.log(message);
            console.log('\r\n');
        });
        site.on('enter', function(message){
            console.log('===enter===');
            console.log(message);
            console.log('\r\n');
        });

        client.subscribeSite(site.getId());

        var api = site.getApi();
        var sceneId = 101;
        var ticket = '';
        api.createLimitQRCode(sceneId, function(err, result){
            ticket = result.ticket;
        });

        var siteClient = client.scanSite(site.getId(), sceneId);
        done();
    })
})


describe('scanSite emitting to WechatEmitter', function() {
    it('succeed to scanSite to trigger qrsubscribe event', function (done) {
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

        var api = site.getApi();
        var sceneId = 101;
        var ticket = '';
        api.createLimitQRCode(sceneId, function(err, result){
            ticket = result.ticket;
        });

        var emitter = new WechatEmitter();
        emitter.qrsubscribe(function(event, context){
            console.log(context.weixin);
            assert.equal(context.weixin.SceneId, sceneId);
            done();
        });
        emitter.bindSite(site);
        var siteClient = client.scanSite(site.getId(), sceneId);
    })

    it('succeed to scanSite to trigger qrSCAN event', function (done) {
        var platform = new Wechat.Platform();
        var client = wxutil.newSignedInClient(platform);
        var site = wxutil.newRegisteredSite(platform);
        site.on('subscribe', function(message){
            console.log('===subscribe===');
            console.log(message);
        });
        site.on('SCAN', function(message){
            console.log('===SCAN===');
            console.log(message);
        });
        site.on('enter', function(message){
            console.log('===enter===');
            console.log(message);
        });

        var api = site.getApi();
        var sceneId = 101;
        var ticket = '';
        api.createLimitQRCode(sceneId, function(err, result){
            ticket = result.ticket;
        });

        var emitter = new WechatEmitter();
        emitter.qrSCAN(function(event, context){
            console.log(context.weixin);
            assert.equal(context.weixin.SceneId, sceneId);
            done();
        });
        emitter.bindSite(site);
        client.subscribeSite(site.getId());

        var siteClient = client.scanSite(site.getId(), sceneId);
    })
})
