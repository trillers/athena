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

});