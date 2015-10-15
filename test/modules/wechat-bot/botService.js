var service = require('../../../src/modules/wechat-bot');
var assert = require('assert');
setTimeout(function(){
    describe('send a msg', function() {
        it('send a text', function(done){
            var mock = {
                ToUserName:'c5ba7380-6445-',
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
            var bid = 'c5ba7380-6445-';
            service.readProfile(bid, function(err, data){
                console.log(data);
                done();
            });
        });
    });
    describe('listen to a msg receiving event', function() {
        it('onReceive', function(done){
            service.onReceive(function(err, data){
                console.log("receive event is fired");
                console.log(data);
                assert.ok(true);
                done();
            });
        });
    });
    describe('listen to a user contact added event', function() {
        it('onAddContact', function(done){
            service.onAddContact(function(err, data){
                console.log("addContact event is fired");
                console.log(data);
                assert.ok(true);
                done();
            });
        });
    });
    run();
}, 5000);
