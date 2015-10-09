/**
 * Admin Service test
 */
var assert = require('chai').assert;
var adminService = require('../../../../src/modules/admin/services/AdminService');
var customerService = require('../../../../src/modules/customer/services/CustomerService');
var csService = require('../../../../src/modules/cs/services/CsService');

var userRole = require('../../../../src/modules/common/models/TypeRegistry').item('UserRole');
var WechatUserService = require('../../../../src/modules/user/services/WechatUserService');

var openid = 'okvXqs4vtB5JDwtb8Gd6Rj26W6mE'; //独自等待的错题本openid
before(function(done){
    setTimeout(function(){
        done();
    }, 3000);
});

describe('AdminService createFromOpenid', function(){
    after(function(done){
        WechatUserService.deleteByOpenid(openid, function(err, user){
            assert.ok(user);
            console.log(user);
            done();
        });
    });
    it('success to create a admin user use openid', function(done){
            adminService.createFromOpenid(openid, function(err, user){
                assert.ok(user);
                assert.equal(user.role, userRole.Admin.value());
                done();
            });
    });
});

describe('AdminService setRoleByOpenid for customer', function(){
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

    it('success to change customer to admin', function(done){
        adminService.setRoleByOpenid(openid, function(err, user){
            assert.ok(user);
            assert.equal(user.role, userRole.Admin.value());
            done();
        });
    });
});

describe('AdminService setRoleByOpenid for cs', function() {
    var cs = null;
    before(function(done){
        csService.createFromOpenid(openid, function(err, user){
            cs = user;
            assert(cs.role, userRole.CustomerService.value());
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
    it('success to change cs to admin', function(done){
        adminService.setRoleByOpenid(openid, function(err, user){
            assert.ok(user);
            assert.equal(user.role, userRole.Admin.value());
            done();
        });
    });
});

describe('AdminService setRoleByOpenid for admin', function() {
    var admin = null;
    before(function(done){
        adminService.createFromOpenid(openid, function(err, user){
            admin = user;
            assert(admin.role, userRole.Admin.value());
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
    it('success to change admin to admin', function(done){
        adminService.setRoleByOpenid(openid, function(err, user){
            assert.ok(user);
            assert.equal(user.role, userRole.Admin.value());
            done();
        });
    });
});