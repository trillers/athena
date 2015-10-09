var assert = require('chai').assert;
var Promise = require('bluebird');
var co = require('co');
var WechatUserService = require('../../../../src/modules/user/services/WechatUserService');
var WechatAuthenticator = require('../../../../src/modules/user/services/WechatAuthenticator');
var authenticator = new WechatAuthenticator({});
var ensureSignin = Promise.promisify(authenticator.ensureSignin.bind(authenticator));

describe('loadOrCreateFromWechat', function() {
    it('succeed to load or create user from wechat', function (done) {
        var openid = 'okvXqsw1VG76eVVJrKivWDgps_gA';
        WechatUserService.loadOrCreateFromWechat(openid, function(err, user){
            assert.ok(user);
            console.log(user);
            done();
        });
    })
})

describe('deleteByOpenid', function() {
    before(function(done){
        var openid = 'okvXqs4vtB5JDwtb8Gd6Rj26W6mE';
        WechatUserService.loadOrCreateFromWechat(openid, function(err, user){
            assert.ok(user);
            console.log(user);
            done();
        });
    })

    it('succeed to delete user by openid', function (done) {
        var openid = 'okvXqs4vtB5JDwtb8Gd6Rj26W6mE';
        WechatUserService.deleteByOpenid(openid, function(err, user){
            assert.ok(user);
            console.log(user);
            done();
        });
    })

})
