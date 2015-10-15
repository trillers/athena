var assert = require('chai').assert;
var Wechat = require('../../../src/framework/wechat/index');

describe('registerUser', function() {
    it('succeed to register a user', function (done) {
        var platform = new Wechat.Platform();
        var customerA = platform.registerUser({username: 'customer-a', nickname: 'Customer A'});
        assert.ok(customerA);
        assert.ok(customerA.getId());
        assert.ok(customerA.getUsername());
        assert.ok(customerA.getNickname());
        assert.ok(customerA.getHeadimgurl());
        assert.ok(customerA.isRegistered());

        console.log(customerA);
        done();
    })

    it('fail to register a user for no username', function (done) {
        var platform = new Wechat.Platform();
        var customerA = null;
        var registerUser = function(){
            customerA = platform.registerUser({nickname: 'Customer A'});
        };
        assert.throws(registerUser, Error, 'need username');
        done();
    })

    it('fail to register a user for no nickname', function (done) {
        var platform = new Wechat.Platform();
        var customerA = null;
        var registerUser = function(){
            customerA = platform.registerUser({username: 'customer-a'});
        };
        assert.throws(registerUser, Error, 'need nickname');
        done();
    })

    it('fail to register a user for username existence', function (done) {
        var platform = new Wechat.Platform();
        var customerA = platform.registerUser({username: 'customer-a', nickname: 'Customer A'});
        var customerB = null;

        var registerUser = function(){
            customerB = platform.registerUser({username: 'customer-a', nickname: 'Customer B'});
        };
        assert.throws(registerUser, Error);
        done();
    })

})
