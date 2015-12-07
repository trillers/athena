var context = require('../../../../../src/index');
var assert = require('chai').assert;

before(function(done){
    setTimeout(function () {
        done();
    }, 2000);
})
describe('PlatformService', function(){
    describe('registerPlatformOperation', function(){
        it('success register platform operation for no subscribe user', function(done){
            var service = context.services.platformService;
            var openid = 'okvXqs4vtB5JDwtb8Gd6Rj26W6mE';//独自等待的错题本openid
            service.ensurePlatformWechatSite(openid, function(err, user){
                context.logger.debug(user);
                assert.equal(user.post)
                done();
            });
        });
    });

});