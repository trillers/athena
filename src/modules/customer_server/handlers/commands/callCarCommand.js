var cskv = require('../../kvs/CustomerServer');
var wechatApi = require('../../../wechat/common/api').api;
var common = require('./commonCommand');
var co = require('co');
var CaseEnum = require('../../../common/models/TypeRegistry').item('Case');
var CaseStatusEnum = require('../../../common/models/TypeRegistry').item('CaseStatus');

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
            var userBiz = yield common.validateUserBindAsync(conversation.initiator);
            if(!userBiz){
                yield wechatApi.sendTextAsync(user.wx_openid, '[系统]:请先绑定用户');
                return callback(new Error('user need bind'), null);
            }
            var css = yield cskv.loadCSSByIdAsync(user.wx_openid);
            var json = {
                payload: {
                    type: CaseEnum.Car.value(),
                    status: CaseStatusEnum.Draft.value(),
                    commissionerId: userBiz._id,
                    commissionerPhone: userBiz.phone,
                    responsibleId: '滴滴打车',
                    conversationId: css._id,
                    carType: 'kc'
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
