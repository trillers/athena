var context = require('../../../../../src');
var logger = context.logger;

before(function(done){
    setTimeout(function () {
        done();
    }, 2000);
});
describe('PlatformUserService', function(){
    describe('create', function(){
        it('Succeed to create a platform user', function(done){
            var service = context.services.platformUserService;
            var openid = 'okvXqsw1VG76eVVJrKivWDgps_gA';
            var user = {
                posts: [{tenant: '001', member: '001', role: 'to'}]
                , openid: openid
                , nickname: '包三哥'
                , headimgurl: 'https://www.baidu.com'
                , sex: 1

                , country: '中国'
                , province: '北京'
                , city: '北京'
                , district: '海淀'
            };

            service.create(user, function(err, user){
                logger.debug(user);
                done();
            });
        });

    });

});