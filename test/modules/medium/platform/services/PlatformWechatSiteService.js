var context = require('../../../../../src');

before(function(done){
    setTimeout(function () {
        done();
    }, 2000);
})
describe('PlatformWechatSiteService', function(){
    describe('createPlatformWechatSite', function(){
        //var platformId = null;
        //before(function(done){
        //    var service = context.services.platformTenantService;
        //    service.loadPlatform(function(err, platform){
        //        platformId = platform.id;
        //        done();
        //    })
        //});

        it('create a platform wechat site', function(done){
            var service = context.services.platformWechatSiteService;
            service.createPlatformWechatSite(function(err, wechatSite){
                context.logger.debug(wechatSite);
                done();
            });
        });

    });

});