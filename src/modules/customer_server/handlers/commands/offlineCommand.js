var cskv = require('../../kvs/CustomerServer');
module.exports = function(user, message, res, callback){
    cskv.saveCSStatusByCSOpenId(user.wx_openid, 'of')
        .then(function(){
            return cskv.remWcCSSetAsync(user.wx_openid)
        })
        .then(function(){
            res.reply('您已下线');
        })
}