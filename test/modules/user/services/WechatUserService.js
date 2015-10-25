var assert = require('chai').assert;
var WechatUserService = require('../../../../src/modules/user/services/WechatUserService');
var mongoose = require('../../../../src/app/mongoose');
var redis = require('../../../../src/app/redis');

before(function(done){
    setTimeout(function(){
        done();
    },3000);
})

describe.only('loadOrCreateFromWechat', function() {
    it('succeed to load or create user from wechat', function (done) {
        //var openid = 'okvXqs_VftHruzwFV9rx4Pbd_fno';
        var openid = 'okvXqsw1VG76eVVJrKivWDgps_gA';
        //var openid = 'okvXqs4vtB5JDwtb8Gd6Rj26W6mE';
        WechatUserService.loadOrCreateFromWechat(openid, function(err, user){
            assert.ok(user);
            console.log(user);
            done();
        });
    })
    //after(function(done){
    //    var openid = 'okvXqsw1VG76eVVJrKivWDgps_gA';
    //    WechatUserService.deleteByOpenid(openid, function(err, user){
    //        assert.ok(user);
    //        console.log(user);
    //        done();
    //    });
    //})
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
