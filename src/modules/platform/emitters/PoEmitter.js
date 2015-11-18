var EventEmitter = require('events').EventEmitter;
var wechatApi = require('../../wechat/common/api').api;

function OperatorEmitter(){
    this.emitter = new EventEmitter();
}
OperatorEmitter.prototype.emit = function(context){
    this.emitter.emit('message', 'message', context);
};
OperatorEmitter.prototype.message = function(handler){ this.emitter.on('message', handler); };
module.exports = OperatorEmitter;