var context = require('../../../../../src/index');

before(function(done){
    setTimeout(function () {
        done();
    }, 2000);
})
describe('PlatformWechatSiteUserService', function(){
    describe('createPlatformWechatSiteUser', function(){
        it('create a platform wechat site user', function(done){
            var service = context.services.platformWechatSiteUserService;
            var wechatSiteUser = {
                nickname: '包三哥',
                openid: 'xxx'
            };

            service.createPlatformWechatSiteUser(wechatSiteUser, function(err, result){
                context.logger.debug(result);
                done();
            });
        });
    });

});