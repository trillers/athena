var context = require('../../../../../src/index');

before(function(done){
    setTimeout(function () {
        done();
    }, 2000);
})
describe('PlatformWechatSiteService', function(){
    describe('ensurePlatformWechatSite', function(){
        it('ensure the platform wechat site', function(done){
            var service = context.services.platformWechatSiteService;
            service.ensurePlatformWechatSite(function(err, wechatSite){
                context.logger.debug(wechatSite);
                done();
            });
        });
    });

    describe('createPlatformWechatSite', function(){
        it('create a platform wechat site', function(done){
            var service = context.services.platformWechatSiteService;
            service.createPlatformWechatSite(function(err, wechatSite){
                context.logger.debug(wechatSite);
                done();
            });
        });
    });

    describe('loadPlatformWechatSite', function(){
        it('load the platform wechat site', function(done){
            var service = context.services.platformWechatSiteService;
            service.loadPlatformWechatSite(function(err, wechatSite){
                context.logger.debug(wechatSite);
                done();
            });
        });
    });

});