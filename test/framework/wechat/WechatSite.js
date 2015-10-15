var assert = require('chai').assert;
var Wechat = require('../../../src/framework/wechat/index');
var wxutil = require('./util');

describe('registerSite', function() {
    it('succeed to register a site', function (done) {
        var platform = new Wechat.Platform();
        var site = platform.registerSite({code: 'genshuixue', name: '跟谁学'})
        assert.ok(site);
        assert.ok(site.isRegistered());
        console.log(site);
        console.log('\r\n');
        done();
    })
})
