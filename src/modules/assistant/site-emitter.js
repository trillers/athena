var WechatEmitter = require('../../framework/WechatEmitter');
var wechatEmitter = new WechatEmitter();
require('../../modules/assistant/handlers/AssistantHandler')(wechatEmitter);
require('../../modules/wechat/handlers/WechatOperationHandler')(wechatEmitter);

module.exports = wechatEmitter;