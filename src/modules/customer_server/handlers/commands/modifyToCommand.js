var cskv = require('../../kvs/CustomerServer');
var wechatApi = require('../../../wechat/common/api').api;
var co = require('co');

module.exports = function(user, message, callback){
    co(function* (){
        try{
            var carOrder = yield cskv.loadPlaceCaseAsync(user.wx_openid);
            if(!carOrder){
                yield wechatApi.sendTextAsync(user.wx_openid, '[系统]:当前没有可修改的用车订单');
                return callback(new Error('no car order'), null);
            }

            carOrder.payload.destination = message;

            cskv.savePlaceCaseAsync(user.wx_openid, json)
                .then(function(){
                    var reply = '[系统]:当前订单：</br>'
                        + '-------------------------------------'
                        + '起点：        ' + carOrder.payload.origin + '</br>'
                        + '终点：        ' + carOrder.payload.destination + '</br>'
                        + '用车时间：     ' + carOrder.payload.time + '</br>';
                    wechatApi.sendText(user.wx_openid, reply, function(err, result){
                        if(callback) return callback(err, result);
                    });
                });
        }catch(e){
            console.log(e)
        }

    })

};
