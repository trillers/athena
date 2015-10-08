var assert = require('chai').assert;
var Promise = require('bluebird');
var co = require('co');
var WechatUserService = require('../../../../src/modules/user/services/WechatUserService');
var WechatAuthenticator = require('../../../../src/modules/user/services/WechatAuthenticator');
var authenticator = new WechatAuthenticator({});
var ensureSignin = Promise.promisify(authenticator.ensureSignin.bind(authenticator));

describe('ensureSignin', function() {
    it('succeed to sigin', function (done) {
        co(function* (){
            try{
                var context = {
                    weixin: {
                        FromUserName: 'okvXqsw1VG76eVVJrKivWDgps_gA'
                    },
                    wxsession: {}
                };
                var user = yield ensureSignin(context.weixin, context);
                assert.ok(user);
                console.log(user);
                done();
            }
            catch(e){
                console.error(e);
                done();
            }
        });
    })

})