var context = require('../../../../../src');

before(function(done){
    setTimeout(function () {
        done();
    }, 2000);
})
describe('WechatMediumService', function(){
    describe('create', function(){
        var platformId = null;
        before(function(done){
            var service = context.services.platformTenantService;
            service.loadPlatform(function(err, platform){
                platformId = platform.id;
                done();
            })
        });

        it('create a wechat bot', function(done){
            var service = context.services.wechatMediumService;
            var wechatSite = {
                name: '包三哥',
                tenant: platformId
            };
            service.create(wechatSite, function(err, tenant){
                context.logger.debug(tenant);
                done();
            });
        });

    });

});