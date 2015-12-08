var EventEmitter = require('events').EventEmitter;
var wechatApi = require('../../wechat/common/api').api;

function PoEmitter(){
    this.emitter = new EventEmitter();
}
PoEmitter.prototype.emit = function(context){
    this.emitter.emit('message', 'message', context);
};
PoEmitter.prototype.message = function(handler){ this.emitter.on('message', handler); };
module.exports = PoEmitter;