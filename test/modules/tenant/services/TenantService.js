var context = require('../../../../src');
var logger = context.logger;

before(function(done){
    setTimeout(function () {
        done();
    }, 2000);
});
describe('TenantService', function(){
    describe('create', function(){
        it('Succeed to create a personal tenant', function(done){
            var service = context.services.tenantService;
            var tenant = {
                name: '包三哥'
            };
            service.create(tenant, function(err, tenant){
                logger.debug(tenant);
                done();
            });
        });

    });

    describe('registerTenant by openid', function(){
        it('registry a personal tenant by openid', function(done){
            var service = context.services.tenantService;
            var openid = 'okvXqs4vtB5JDwtb8Gd6Rj26W6mE';//独自等待的错题本openid
            service.registerTenant(openid, function(err, tenant){
                context.logger.debug(tenant);
                done();
            });
        });

    });
});