var WechatEmitter = require('../../../framework/WechatEmitter');
var ContextDecorator = require('./common/ContextDecorator');

var wechatEmitter = new WechatEmitter();
wechatEmitter.setContextDecorator(new ContextDecorator());

//require('./eventHandler')(wechatEmitter);
require('./messageHandler')(wechatEmitter);
//require('./loggingHandler')(wechatEmitter);

module.exports = wechatEmitter;