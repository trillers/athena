var cskv = require('../../kvs/CustomerServer');
module.exports = function(user, message, ctx, callback){
    cskv.saveCSStatusByCSOpenId(user.wx_openid, 'ol')
        .then(function(){
            return cskv.pushWcCSSetAsync(user.wx_openid);
        })
        .then(function(){
            ctx.body = '您已上线';
        })
}