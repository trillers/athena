var cskv = require('../../kvs/CustomerServer');
var wechatApi = require('../../../wechat/common/api').api;

module.exports = function(user, message, callback){
        cskv.remWcCSSetAsync(user.wx_openid)
        .then(function(){
            return cskv.delCSSByIdAsync(user.wx_openid);
        })
        .then(function(){
            wechatApi.sendText(user.wx_openid, '您已下线', function(err, result){
                if(callback) return callback(err, result);
            });
        });
}