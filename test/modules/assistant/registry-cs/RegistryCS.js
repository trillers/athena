/**
 * Registry CS throw scan qr code test
 */
var assert = require('chai').assert;
var Wechat = require('../../../../src/framework/wechat/index');
var WechatSiteEmitter = require('../../../../src/framework/wechat/wechat-site-emitter');
var Wechat = require('../../../../src/framework/wechat/index');
var siteEmitter = require('../../../../src/modules/assistant/site-emitter');
var mongoose = require('../../../../src/app/mongoose');
var redis = require('../../../../src/app/redis');

before(function(done){
    setTimeout(function(){
        done();
    },3000);
})

describe('Registry CS', function(){
    it('success subscribe throw scan param qrCode to become customer service', function(done){

        done();
    })
});