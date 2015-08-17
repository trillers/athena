var cskv = require('../../kvs/CustomerServer');
var taskQueue = require('../../../conversation/common/ConversationQueue');
module.exports = function(user, message, res, callback){
    taskQueue.emit('taskFinish', {csId: user.wx_openid});
    res.reply('已关闭当前会话。');
}