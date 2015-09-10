var cskv = require('../../kvs/CustomerService');
var wechatApi = require('../../../wechat/common/api').api;
var CaseService = require('../../../case/services/CaseService');
var co = require('co');

module.exports = function(user, message, callback){
    co(function* (){
        try{
            var conversation = yield cskv.loadCSSByIdAsync(user.wx_openid);
            if(!conversation){
                yield wechatApi.sendTextAsync(user.wx_openid, '[系统]:当前没有会话');
                return callback(new Error('no session'), null);
            }
            var userBiz = yield common.validateUserBindAsync(conversation.initiator);

            carOrder.payload.origin = message;

            cskv.savePlaceCaseAsync(user.wx_openid, json)
                .then(function(){
                    var reply = '[系统]:当前订单：</br>'
                        + '-------------------------------------'
                        + '起点：        ' + carOrder.payload.origin + '</br>'
                        + '终点：        ' + carOrder.payload.destination + '</br>'
                        + '用车时间：     ' + carOrder.payload.useTime + '</br>';
                    wechatApi.sendText(user.wx_openid, reply, function(err, result){
                        if(callback) return callback(err, result);
                    });
                });
        }catch(e){
            console.log(e)
        }

    })

};
