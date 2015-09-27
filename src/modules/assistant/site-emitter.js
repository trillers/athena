var WechatEmitter = require('../../framework/WechatEmitter');
var wechatEmitter = new WechatEmitter();
require('./handlers/AssistantEventHandler')(wechatEmitter);
require('./handlers/AssistantMessageHandler')(wechatEmitter);
require('../../modules/wechat/handlers/WechatOperationHandler')(wechatEmitter);

module.exports = wechatEmitter;