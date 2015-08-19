var cskv = require('../../kvs/CustomerServer');
module.exports = function(user, message, ctx, callback){
    //save to redis
    //placeCase:openid  {type: 2ct, payload:{xxx: 1, yyy: 2}, step:2}
    var json = {
        type: 'ct',
        payload: {

        },
        step: 1
    }
    cskv.savePlaceCaseAsync(user.wx_openid, json)
    .then(function(){
        ctx.body = '用车时间是？';
    })
}