var context = require('../../../../../src');
var WechatMediumUserType = require('../../../../../src/modules/common/models/TypeRegistry').item('WechatMediumUserType');

before(function(done){
    setTimeout(function () {
        done();
    }, 2000);
})
describe('WechatMediumUserService', function(){
    describe('create', function(){
        var wechatSiteId = null;
        before(function(done){
            var service = context.services.platformWechatSiteService;
            service.loadPlatformWechatSite(function(err, wechatSite){
                wechatSiteId = wechatSite.id;
                done();
            })
        });

        it('create a wechat site user', function(done){
            var service = context.services.wechatMediumUserService;
            var wechatSiteUser = {
                host: wechatSiteId,
                type: WechatMediumUserType.WechatSiteUser.value(),
                nickname: '包三哥',
                openid: 'xxx'
            };
            service.create(wechatSiteUser, function(err, tenant){
                context.logger.debug(tenant);
                done();
            });
        });

    });

});