var assert = require('chai').assert;
var CommandRegistry = require('../../../src/framework/wechat/command-registry');

describe('extractCommand', function() {
    it('succeed to extract and execute command from text', function (done) {
        var registry = new CommandRegistry();
        var firstCommand = false;
        var secondCommand = false;
        var nonCommand = false;
        var handler = null;

        registry.addCommand('删除当前用户', function(msg, user){
            firstCommand = true;
            console.log( '删除当前用户' + ' - 命令已执行！');
            console.log(msg);
            console.log(user);
        });
        registry.addCommand('状态', function(msg, user){
            secondCommand = true;
            console.log( '状态' + ' - 命令已执行！');
            console.log(msg);
            console.log(user);
        });

        var msg = {
            MsgType: 'text',
            Content: ''
        };
        var user = {
            id: '001',
            wx_nickname: '数学老师'
        };

        msg.Content = '删除当前用户';
        handler = registry.extractCommand(msg.Content, msg, user);
        assert.ok(handler);
        handler();
        assert.ok(firstCommand);

        msg.Content = '状态';
        handler = registry.extractCommand(msg.Content, msg, user);
        assert.ok(handler);
        handler();
        assert.ok(secondCommand);

        msg.Content = '你好！';
        handler = registry.extractCommand(msg.Content, msg, user);
        assert.notOk(handler);
        console.log(msg.Content + ' - 此消息不是【命令消息】');
        assert.notOk(nonCommand);

        msg.Content = '';
        handler = registry.extractCommand(msg.Content, msg, user);
        assert.notOk(handler);
        console.log(msg.Content + ' - 此消息不是【命令消息】');
        assert.notOk(nonCommand);

        done();
    })
})

describe('extractCommandFromMessage', function() {
    it('succeed to extract and execute command from a message', function (done) {
        var registry = new CommandRegistry();
        var firstCommand = false;
        var secondCommand = false;
        var nonCommand = false;
        var handler = null;

        registry.addCommand('删除当前用户', function(msg, user){
            firstCommand = true;
            console.log( '删除当前用户' + ' - 命令已执行！');
            console.log(msg);
            console.log(user);
        });
        registry.addCommand('状态', function(msg, user){
            secondCommand = true;
            console.log( '状态' + ' - 命令已执行！');
            console.log(msg);
            console.log(user);
        });

        var msg = {
                MsgType: 'text',
                Content: ''
            };
        var user = {
            id: '001',
            wx_nickname: '数学老师'
        };

        msg.Content = '删除当前用户';
        handler = registry.extractCommandFromMessage(msg, msg, user);
        assert.ok(handler);
        handler();
        assert.ok(firstCommand);

        msg.Content = '状态';
        handler = registry.extractCommandFromMessage(msg, msg, user);
        assert.ok(handler);
        handler();
        assert.ok(secondCommand);

        msg.Content = '你好！';
        handler = registry.extractCommandFromMessage(msg, msg, user);
        assert.notOk(handler);
        console.log(msg.Content + ' - 此消息不是【命令消息】');
        assert.notOk(nonCommand);

        msg.Content = '';
        handler = registry.extractCommandFromMessage(msg, msg, user);
        assert.notOk(handler);
        console.log(msg.Content + ' - 此消息不是【命令消息】');
        assert.notOk(nonCommand);

        done();
    })
})
