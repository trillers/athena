var service = require('../../../src/modules/wechat-bot');

setTimeout(function(){
    describe('listen to a msg receiving event', function() {
        it('onReceive', function(done){
            service.onReceive(function(err, data){
                console.log(data);
                done();
            });
        });
    });
    describe('listen to a user contact added event', function() {
        it('onAddContact', function(done){
            service.onAddContact(function(err, data){
                console.log(data);
                done();
            });
        });
    });
    describe('send a msg', function() {
        it('send a text', function(done){
            var mock = {
                ToUserName:'独自等待',
                MsgType:'text',
                Content:'hello',
                Url:'',
                MsgId:(new Date()).getTime()
            };
            service.send(mock, function(err, data){
                console.log(data);
                done();
            });
        });
    });
    describe('read a user profile', function() {
        it('readProfile', function(done){
            var bid = '独自等待';
            service.readProfile(bid, function(err, data){
                console.log(data);
                done();
            });
        });
    });
    run();
}, 5000)
