var context = require('../../../../src');

before(function(done){
    setTimeout(function () {
        done();
    }, 4000);
})
describe('TenantService', function(){
    describe('create', function(){
        it('create a personal tenant', function(done){
            var service = context.services.tenantService;
            var tenant = {
                name: '包三哥'
            };
            service.create(tenant, function(err, tenant){
                context.logger.debug(tenant);
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