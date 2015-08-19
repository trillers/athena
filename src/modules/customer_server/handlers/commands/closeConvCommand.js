var cskv = require('../../kvs/CustomerServer');
var taskQueue = require('../../../conversation/common/ConversationQueue');
module.exports = function(user, message, ctx, callback){
    taskQueue.emit('taskFinish', {csId: user.wx_openid});
    ctx.body = '已关闭当前会话。';
}