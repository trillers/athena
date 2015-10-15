var assert = require('chai').assert;
var Wechat = require('../../../src/framework/wechat/index');
var wxutil = require('./util');

describe('createTmpQRCode', function() {
    it('succeed to create a temp qrcode', function (done) {
        var platform = new Wechat.Platform();
        var site = wxutil.newRegisteredSite(platform);
        var api = site.getApi();
        assert.ok(api);
        api.createTmpQRCode(101, 3600, function(err, result){
            assert.notOk(err);
            assert.ok(result.ticket);
            assert.equal(result.expire_seconds, 3600);
        });
        console.log(site);
        done();
    })
})

describe('createLimitQRCode', function() {
    it('succeed to create a limit qrcode', function (done) {
        var platform = new Wechat.Platform();
        var site = wxutil.newRegisteredSite(platform);
        var api = site.getApi();
        assert.ok(api);
        api.createLimitQRCode(101, function(err, result){
            assert.notOk(err);
            assert.ok(result.ticket);
        });
        console.log(site);
        done();
    })
})


