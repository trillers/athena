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

});