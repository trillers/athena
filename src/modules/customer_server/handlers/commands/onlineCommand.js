var cskv = require('../../kvs/CustomerServer');
module.exports = function(user, message, res, callback){
    cskv.saveCSStatusByCSOpenId(user.wx_openid, 'ol')
        .then(function(){
            return cskv.pushWcCSSetAsync(user.wx_openid);
        })
        .then(function(){
            res.reply('您已上线');
        })
}