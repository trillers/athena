var cskv = require('../../kvs/CustomerService');
var wechatApi = require('../../../wechat/common/api').api;
var co = require('co');
var CaseStatusEnum = require('../../../common/models/TypeRegistry').item('CaseStatus');
var caseService = require('../../../case/services/CaseService');

module.exports = function(user, message, callback){
    co(function* (){
        try{
            var carOrder = yield cskv.loadPlaceCaseAsync(user.wx_openid);
            if(!carOrder){
                yield wechatApi.sendTextAsync(user.wx_openid, '[系统]:当前没有可提交的用车订单');
                return callback(new Error('no car order'), null);
            }

            var carCase = {
                type: 'car',
                commissionerPhone: carOrder.commissionerPhone,
                conversationId: carOrder.conversationId,
                useTime: carOrder.payload.useTime,
                origin: carOrder.payload.origin,
                destination: carOrder.payload.destination
            };
            //var doc = yield createCaseToMango(carOrder.payload, user);
            redis.publish('DDCallFastCar', JSON.stringify(carCase));
            carOrder.payload.caseId = doc._id;
            carOrder.payload.status = CaseStatusEnum.Reviewing.value();
            cskv.savePlaceCaseAsync(user.wx_openid, carOrder)
                .then(function(){
                    var reply = '[系统]:用车需求已发送';
                    wechatApi.sendText(user.wx_openid, reply, function(err, result){
                        if(callback) return callback(err, result);
                    });
                });
        }catch(e){
            console.log(e)
        }

    })

};

function* createCaseToMango(data, user){
    try{
        var doc = yield caseService.create(data);
        //redis.publish('call_taxi', JSON.stringify(doc));
        //yield wechatApi.sendTextAsync(user.wx_openid, '[系统]:下单成功');
        yield cskv.saveCSStatusByCSOpenIdAsync(user.wx_openid, 'busy');
        return doc;

        //yield cskv.delPlaceCaseAsync(user.wx_openid);
    }catch(err){
        yield wechatApi.sendTextAsync(user.wx_openid, '[系统]:下单失败，请联系管理员');
        yield cskv.delPlaceCaseAsync('tx', user.wx_openid);
        return null
    }
}