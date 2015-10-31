var assert = require('assert');
var botManager = require('../../../src/modules/assistant/botManager');


describe('mass to wechat group', function(){
    before(function(done){
        setTimeout(function(){
            require('../../../src/app/index');
            done();
        }, 5000)
    })
   it('success mass to wechat group', function(done){
       var mockMsg = {
           ToUserName: '交流',
           FromUserName: 'gh_afc333104d2a:okvXqs0hcg0a10Lr5vOEPfWIVA94',//sbot id mock
           MsgType: 'text',
           Content: '打扰了'
       }
       botManager.sendText(mockMsg.FromUserName, mockMsg);
       done();
   })
});
