var assert = require('chai').assert;
var wxutil = require('../../../../framework/wechat/util');
var Wechat = require('../../../../../src/framework/wechat/index');
var siteEmitter = require('../../../../../src/modules/assistant/site-emitter');
var openid = 'okvXqs4vtB5JDwtb8Gd6Rj26W6mE'; //独自等待的错题本openid
var customerService = require('../../../../../src/modules/customer/services/CustomerService');
var userRole = require('../../../../../src/modules/common/models/TypeRegistry').item('UserRole');
var WechatUserService = require('../../../../../src/modules/user/services/WechatUserService');


before(function(done){
    setTimeout(function(){
        done();
    },2000);
})

describe('setRoleToCustomer', function() {
    var customer = null;
    before(function(done){
        customerService.createFromOpenid(openid, function(err, data){
            customer = data;
            assert(customer.role, userRole.Customer.value());
            done();
        });
    });
    after(function(done){
        WechatUserService.deleteByOpenid(openid, function(err, user){
            assert.ok(user);
            console.log(user);
            done();
        });
    });
    it('succeed to set role to customer', function (done) {
        var platform = new Wechat.Platform();
        var client = wxutil.newSignedInClient(platform);
        var site = wxutil.newRegisteredSite(platform);
        siteEmitter.bindSite(site);
        var siteClient = client.subscribeSite(site.getId(), openid);

        site.on('text', function(message){
            console.log('=== text message ===');
            console.log(message);
            console.log('\r\n');
        });
        assert.ok(site.getId());


        siteClient.sendText({
            Content: '成为客户'
        });

        setTimeout(function(){
            done();
        }, 1000);
    })
})
