var cskv = require('../../kvs/CustomerServer');
var wechatApi = require('../../../wechat/common/api').api;
module.exports = function(user, message, callback){
        cskv.resetCSStatusTTLByCSOpenIdAsync(user.wx_openid)
        .then(function(){
            return cskv.pushWcCSSetAsync(user.wx_openid);
        })
        .then(function(){
            return require('../../../conversation/common/ConversationQueue').emit('csOnline', {csId: user.wx_openid});
        })
        .then(function(){
            wechatApi.sendText(user.wx_openid, '您已上线', function(err, result){
                if(callback) return callback(err, result);
            });
        });
}