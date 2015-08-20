var cskv = require('../../kvs/CustomerServer');
//var taskQueue = require('../../../conversation/common/ConversationQueue');
var wechatApi = require('../../../wechat/common/api').api;

module.exports = function(user, message, callback){
    require('../../../conversation/common/ConversationQueue').emit('taskFinish', {csId: user.wx_openid});
    wechatApi.sendText(user.wx_openid, '已关闭当前会话', function(err, result){
        if(callback) return callback(err, result);
    });
}