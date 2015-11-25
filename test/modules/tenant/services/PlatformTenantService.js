var assert = require('chai').assert;
var context = require('../../../../src');
var logger = context.logger;
var TenantType = require('../../../../src/modules/common/models/TypeRegistry').item('TenantType');

before(function(done){
    setTimeout(function () {
        done();
    }, 2000);
});
describe('PlatformTenantService', function(){
    describe('createPlatform', function(){
        it('Succeed to create a platfrom tenant', function(done){
            var service = context.services.platformTenantService;
            service.createPlatform(function(err, platform){
                logger.debug(platform);
                assert.equal(platform.type, TenantType.Organizational.value());
                assert.equal(platform.administrative, true);

                done();
            });
        });

    });

    describe('loadPlatform', function(){
        it('Succeed to load the platfrom tenant', function(done){
            var service = context.services.platformTenantService;
            service.loadPlatform(function(err, platform){
                logger.debug(platform);
                assert.equal(platform.type, TenantType.Organizational.value());
                assert.equal(platform.administrative, true);
                done();
            });
        });

    });

});