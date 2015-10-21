var assert = require('chai').assert;
var wxutil = require('../../../../framework/wechat/util');
var Wechat = require('../../../../../src/framework/wechat/index');
var siteEmitter = require('../../../../../src/modules/assistant/site-emitter');
var openid = 'okvXqsw1VG76eVVJrKivWDgps_gA'; //包三哥的错题本openid
var botService = require('../../../../../src/modules/wechat-bot/services/BotUserService');
var userRole = require('../../../../../src/modules/common/models/TypeRegistry').item('UserRole');
var WechatUserService = require('../../../../../src/modules/user/services/WechatUserService');


before(function(done){
    setTimeout(function(){
        done();
    },2000);
})

describe('startBotCommand', function() {
    var customer = null;
    before(function(done){
        botService.createFromOpenid(openid, function(err, data){
            customer = data;
            assert(customer.role, userRole.Bot.value());
            done();
        });
    });
    after(function(done){
        WechatUserService.deleteByOpenid(openid, function(err, user){
            assert.ok(user);
            console.log(user);
            done();
        });
    });
    it('succeed to start and stop bot', function (done) {
        var platform = new Wechat.Platform();
        var client = wxutil.newSignedInClient(platform);
        var site = wxutil.newRegisteredSite(platform);
        siteEmitter.bindSite(site);
        var siteClient = client.subscribeSite(site.getId(), openid);

        site.on('text', function(message){
            console.log('=== text message ===');
            console.log(message);
            console.log('\r\n');
        });

        siteClient.sendText({
            Content: '成为微信助手'
        });

        setTimeout(function(){
            siteClient.sendText({
                Content: '启动助手'
            });
        }, 500);

        setTimeout(function(){
            siteClient.sendText({
                Content: '停止助手'
            });
        }, 1000);

        setTimeout(function(){
            done();
        }, 1500);
    })
})

