var cskv = require('../../kvs/CustomerServer');
var wechatApi = require('../../../wechat/common/api').api;
var co = require('co');
var CaseStatusEnum = require('../../../common/models/TypeRegistry').item('CaseStatus');
var caseService = require('../../../case/services/CaseService');

module.exports = function(user, message, callback){
    co(function* (){
        try{
            var carOrder = yield cskv.loadPlaceCaseAsync(user.wx_openid);
            if(!carOrder){
                yield wechatApi.sendTextAsync(user.wx_openid, '[系统]:当前没有可修改的用车订单');
                return callback(new Error('no car order'), null);
            }

            var carCase = {
                name: 'callFastCar',
                from: carOrder.payload.origin,
                to: carOrder.payload.destination,
                startTime: carOrder.payload.time,
                user: {
                    phone: carOrder.commissionerPhone
                }
            };
            var doc = yield createCaseToMango(carOrder.payload, user);
            redis.publish('call_car', JSON.stringify(carCase));
            carOrder.payload.caseId = doc._id;
            carOrder.payload.status = CaseStatusEnum.Reviewing.value();
            return cskv.savePlaceCaseAsync(user.wx_openid, carOrder);

            cskv.savePlaceCaseAsync(user.wx_openid, json)
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