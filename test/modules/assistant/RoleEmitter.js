var RoleEmitter = require('../../../src/modules/assistant/common/RoleEmitter');
var assert = require('chai').assert;

describe('customer event', function() {
    it('customer', function (done) {
        var emitter = new RoleEmitter();
        var context = {
            weixin: {MsgType: 'text', Content: 'hello'},
            user: {id: 'test', openid: 'asfsafadsf', role: 'customer'}
        };
        emitter.customer(function (event, context) {
            assert.equal(event, 'customer');
            assert.equal(context.weixin.Content, 'hello');
            console.info(event);
            console.info(context);
        });
        emitter.emit(context);
        done();
    })

})

describe('cs event', function() {
    it('cs', function (done) {
        var emitter = new RoleEmitter();
        var context = {
            weixin: {MsgType: 'text', Content: 'hello'},
            user: {id: 'test', openid: 'asfsafadsf', role: 'cs'}
        };
        emitter.cs(function (event, context) {
            assert.equal(event, 'cs');
            assert.equal(context.weixin.Content, 'hello');
            console.info(event);
            console.info(context);
        });
        emitter.emit(context);
        done();
    })

})

describe('admin event', function() {
    it('admin', function (done) {
        var emitter = new RoleEmitter();
        var context = {
            weixin: {MsgType: 'text', Content: 'hello'},
            user: {id: 'test', openid: 'asfsafadsf', role: 'admin'}
        };
        emitter.admin(function (event, context) {
            assert.equal(event, 'admin');
            assert.equal(context.weixin.Content, 'hello');
            console.info(event);
            console.info(context);
        });
        emitter.emit(context);
        done();
    })

})
