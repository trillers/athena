var context = require('../../../../src');

before(function(done){
    setTimeout(function () {
        done();
    }, 4000);
})
describe('WechatMediumService', function(){
    describe('create', function(){
        it('create a wechat bot', function(done){
            var service = context.services.wechatMediumService;
            var wechatSite = {
                name: '包三哥'
            };
            service.create(tenant, function(err, tenant){
                context.logger.debug(tenant);
                done();
            });
        });

    });

});