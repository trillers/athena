var context = require('../../../../../src');

before(function(done){
    setTimeout(function () {
        done();
    }, 2000);
})
describe('PlatformWechatSiteUserService', function(){
    //describe('ensurePlatformWechatSiteUser', function(){
    //    it('ensure the platform wechat site user', function(done){
    //        var service = context.services.platformWechatSiteUserService;
    //        service.ensurePlatformWechatSiteUser(function(err, user){
    //            context.logger.debug(user);
    //            done();
    //        });
    //    });
    //});

    describe('createPlatformWechatSiteUser', function(){
        it('create a platform wechat site', function(done){
            var service = context.services.platformWechatSiteService;
            service.createPlatformWechatSite(function(err, wechatSite){
                context.logger.debug(wechatSite);
                done();
            });
        });
    });

    //describe('loadPlatformWechatSite', function(){
    //    it('load the platform wechat site', function(done){
    //        var service = context.services.platformWechatSiteService;
    //        service.loadPlatformWechatSite(function(err, wechatSite){
    //            context.logger.debug(wechatSite);
    //            done();
    //        });
    //    });
    //});

});