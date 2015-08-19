var cskv = require('../../kvs/CustomerServer');
var wechatApi = require('../../../wechat/common/api').api;

module.exports = function(user, message, callback){
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
        wechatApi.sendText(user.wx_openid, '用车时间是?', function(err, result){
            if(callback) return callback(err, result);
        });
    })
}