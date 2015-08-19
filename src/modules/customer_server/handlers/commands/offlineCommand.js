var cskv = require('../../kvs/CustomerServer');
module.exports = function(user, message, ctx, callback){
    cskv.saveCSStatusByCSOpenId(user.wx_openid, 'of')
        .then(function(){
            return cskv.remWcCSSetAsync(user.wx_openid)
        })
        .then(function(){
            ctx.body = '您已下线';
        })
}