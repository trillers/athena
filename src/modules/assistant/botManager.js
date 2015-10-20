var WechatBotManager = require('../wechat-bot/services/WechatBotManager');

var botManager = new WechatBotManager();
//require('../../modules/wechat/handlers/WechatOperationHandler')(wechatEmitter);

module.exports = botManager;