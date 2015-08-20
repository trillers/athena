var cskv = require('../../kvs/CustomerServer');
var wechatApi = require('../../../wechat/common/api').api;
var conversationQueue = require('../../../conversation/common/ConversationQueue');
module.exports = function(user, message, callback){
    cskv.saveCSStatusByCSOpenIdAsync(user.wx_openid, 'ol')
        .then(function(){
            return cskv.pushWcCSSetAsync(user.wx_openid);
        })
        .then(function(){
            console.log('queue----------------------' + require('util').inspect(conversationQueue));
            return conversationQueue.emit('csOnline', {csId: user.wx_openid});
        })
        .then(function(){
            wechatApi.sendText(user.wx_openid, '您已上线', function(err, result){
                if(callback) return callback(err, result);
            });
        });
}