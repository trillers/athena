var assert = require('chai').assert;
var wxutil = require('../../framework/wechat/util');
var Wechat = require('../../../src/framework/wechat/index');
var siteEmitter = require('../../../src/modules/assistant/site-emitter');
var mongoose = require('../../../src/app/mongoose');
var redis = require('../../../src/app/redis');
var csService = require('../../../src/modules/cs/services/CsService');
var customerService = require('../../../src/modules/customer/services/CustomerService');
var WechatUserService = require('../../../src/modules/user/services/WechatUserService');
before(function(done){
    setTimeout(function(){
        done()
    }, 3000)
});
describe('send a customer message', function () {
    var mock = {};
    before(function(done){
        prepareData(mock)
        .then(function(){
            console.log("~~~~~~~~~~~~~~~~~");
            done();
        })
    });

    describe('cs send a plain message', function () {
        before(function(done){
            done();
        });
        it('has no cvs', function(done){
            assert.ok(mock.site.getId());
            console.log(assert.ok);
            mock.siteClientB.sendText({
                Content: 'Hi'
            });
            setTimeout(function(){
                done()
            }, 2000)
        });
    });

    describe('cs send a online cmd', function () {
        before(function(done){
            done();
        });
        it('online', function(done){
            assert.ok(mock.site.getId());
            console.log(assert.ok);
            mock.siteClientB.sendText({
                Content: '上线'
            });
            setTimeout(function(){
                done()
            }, 2000)
        });
    });

    describe('cs send a offline cmd', function () {
        before(function(done){
            done();
        });
        it('offline', function(done){
            assert.ok(mock.site.getId());
            console.log(assert.ok);
            mock.siteClientB.sendText({
                Content: '下线'
            });
            setTimeout(function(){
                done()
            }, 2000)
        });
    });

    describe('cs send a status cmd', function () {
        before(function(done){
            done();
        });
        it('should be offline', function(done){
            assert.ok(mock.site.getId());
            console.log(assert.ok);
            mock.siteClientB.sendText({
                Content: '状态'
            });
            setTimeout(function(){
                done()
            }, 2000)
        });
    });

    describe('create a new conversation and assign it to a free cs', function () {
        before(function(done){
            prepareData(mock)
                .then(function(){
                    done();
                });

        });
        after(function(done){
            console.log('enter after hook---------');
            mock.siteClientB.sendText({
                Content: '关闭'
            });
            setTimeout(function(){
                done();
            }, 3000);
        });
        it('a cs online and free, then a custom send a msg, the cvs assign to the cs', function(done){
            assert.ok(mock.site.getId());
            mock.siteClientB.sendText({
                Content: '上线'
            });
            setTimeout(function(){
                mock.siteClientA.sendText({
                    Content: 'Hi'
                });
                setTimeout(function(){
                    mock.siteClientB.sendText({
                        Content: 'Hi?'
                    });
                    setTimeout(function(){
                        done();
                    }, 2000);
                }, 2000);
            }, 2000);
        });
    });


});
function prepareData(mock){
    mock.openid = 'okvXqs4vtB5JDwtb8Gd6Rj26W6mE'; //独自等待的错题本openid
    mock.prepareOpenid = 'okvXqswFmgRwEV0YrJ-h5YvKhdUk'; //祺天大圣的openid
    return csService.createFromOpenidAsync(mock.prepareOpenid)
        .then(function(user){
            assert.equal(user.role, 'cs');
            return customerService.createFromOpenidAsync(mock.openid)
        })
        .then(function(user){
            assert.equal(user.role, 'cu');
            mock.platform = new Wechat.Platform();
            mock.clientA = wxutil.newSignedInClient(mock.platform);
            mock.clientB = wxutil.newSignedInClient(mock.platform);
            mock.site = wxutil.newRegisteredSite(mock.platform);
            siteEmitter.bindSite(mock.site);
            mock.siteClientA = mock.clientA.subscribeSite(mock.site.getId(), mock.openid);
            mock.siteClientB = mock.clientB.subscribeSite(mock.site.getId(), mock.prepareOpenid);
        })
}