/**
 * Registry CS throw scan qr code test
 */
var assert = require('chai').assert;
var wxutil = require('../../../framework/wechat/util');
var Wechat = require('../../../../src/framework/wechat/index');
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
        var platform = new Wechat.Platform();
        var client = wxutil.newSignedInClient(platform);
        var site = wxutil.newRegisteredSite(platform);
        siteEmitter.bindSite(site);
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
        var openid = 'okvXqs4vtB5JDwtb8Gd6Rj26W6mE'; //独自等待的错题本openid
        var api = site.getApi();
        var sceneId = 101;
        var ticket = '';
        api.createLimitQRCode(sceneId, function(err, result){
            ticket = result.ticket;
        });
        //client.scanSite(site.getId(), sceneId, openid);
        setTimeout(function(){
            done();
        }, 4000);
    })
});