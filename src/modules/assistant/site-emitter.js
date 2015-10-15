var Promise = require('bluebird');
var WechatEmitter = require('../../framework/WechatEmitter');
var ContextDecorator = require('./common/ContextDecorator');

var wechatEmitter = new WechatEmitter();
wechatEmitter.setContextDecorator(new ContextDecorator());
require('./handlers/AssistantEventHandler')(wechatEmitter);
require('./handlers/AssistantMessageHandler')(wechatEmitter);
require('../../modules/wechat/handlers/WechatOperationHandler')(wechatEmitter);

module.exports = wechatEmitter;