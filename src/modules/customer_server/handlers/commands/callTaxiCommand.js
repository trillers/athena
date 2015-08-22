var cskv = require('../../kvs/CustomerServer');
var wechatApi = require('../../../wechat/common/api').api;
var common = require('./commonCommand');
var co = require('co')

module.exports = function(user, message, callback){
    //save to redis
    //placeCase:openid  {type: 2ct, payload:{xxx: 1, yyy: 2}, step:2}
    co(function* (){
        try{
            var conversation = yield cskv.loadCSSByIdAsync(user.wx_openid);
            if(!conversation){
                yield wechatApi.sendTextAsync(user.wx_openid, '[系统]:当前没有会话');
                return callback(new Error('no session'), null);
            }
            var bindOrNot = yield common.validateUserBindAsync(conversation.initiator);
            if(!bindOrNot){
                yield wechatApi.sendTextAsync(user.wx_openid, '[系统]:请先绑定用户');
                return callback(new Error('user need bind'), null);
            }
            var json = {
                type: 'ct',
                payload: {

                },
                step: 1
            };
            cskv.savePlaceCaseAsync(user.wx_openid, json)
                .then(function(){
                    wechatApi.sendText(user.wx_openid, '[系统]:用车时间是?', function(err, result){
                        if(callback) return callback(err, result);
                    });
                });
        }catch(e){
            console.log(e)
        }

    })

};
