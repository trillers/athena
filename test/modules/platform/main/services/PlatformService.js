var context = require('../../../../../src/index');
var assert = require('chai').assert;
var TenantMemberRole = require('../../../../../src/modules/common/models/TypeRegistry').item('TenantMemberRole');

before(function(done){
    setTimeout(function () {
        done();
    }, 2000);
})
describe('PlatformService', function(){
    describe('registerPlatformOperation', function(){
        it('success register platform operation for no subscribe user', function(done){
            var service = context.services.platformService;
            var openid = 'okvXqs4vtB5JDwtb8Gd6Rj26W6mE';//独自等待的错题本openid
            service.registerPlatformPost(openid, TenantMemberRole.PlatformOperation.value(), function(err, user){
                assert.equal(user.posts[0].role, TenantMemberRole.PlatformOperation.value());
                done();
            });
        });

        it('platform operation upgrade platform admin', function(done){
            var service = context.services.platformService;
            var openid = 'okvXqs4vtB5JDwtb8Gd6Rj26W6mE';//独自等待的错题本openid
            service.registerPlatformPost(openid, TenantMemberRole.PlatformOperation.value(), function(err, user){
                assert.equal(user.posts[0].role, TenantMemberRole.PlatformOperation.value());

                service.registerPlatformPost(openid, TenantMemberRole.PlatformAdmin.value(), function(err, user){
                    assert.equal(user.posts[0].role, TenantMemberRole.PlatformAdmin.value());
                    done();
                });
            });
        });

        it('platform admin register platform operation', function(done){
            var service = context.services.platformService;
            var openid = 'okvXqsw1VG76eVVJrKivWDgps_gA';//包三哥的错题本openid
            service.registerPlatformPost(openid, TenantMemberRole.PlatformAdmin.value(), function(err, user){
                assert.equal(user.posts[0].role, TenantMemberRole.PlatformAdmin.value());

                service.registerPlatformPost(openid, TenantMemberRole.PlatformOperation.value(), function(err, user){
                    assert.equal(user.posts[0].role, TenantMemberRole.PlatformAdmin.value());
                    done();
                });
            });
        });
    });

});